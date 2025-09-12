/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { revalidatePath } from 'next/cache'
import ZarinPalCheckout from 'zarinpal-checkout'
import prisma from '@/lib/prisma'
// import { PaymentResult } from '../schemas'
import { getCurrentUser } from '@/lib/auth-helpers'
import { checkRateLimit } from '@/lib/utils'
import { PaymentError } from '@/lib/errors'
// import { createHash } from 'crypto'

// Types
interface ZarinpalPaymentFormState {
  errors: {
    orderId?: string[]
    amount?: string[]
    _form?: string[]
  }
  payment?: {
    status?: number
    authority?: string
    url?: string
  }
}

// interface PaymentVerificationResult {
//   status: number
//   refId: number
// }

interface PaymentRequestResult {
  status: number
  authority: string
  url: string
}

// Constants
const PAYMENT_STATUS = {
  SUCCESS: 100,
  OK: 'OK',
  NOK: 'NOK',
} as const

const ERROR_MESSAGES = {
  UNAUTHORIZED: 'شما اجازه دسترسی ندارید!',
  ORDER_NOT_FOUND: 'سفارش در دسترس نیست!',
  ORDER_DELETED: 'سفارش حذف شده است!',
  INVALID_PAYMENT_RESPONSE: 'پاسخ درگاه پرداخت معتبر نیست!',
  INVALID_PAYMENT_INFO: 'اطلاعات پرداخت نادرست است!',
  PAYMENT_ERROR: 'پرداخت با خطا مواجه شده است!',
  PAYMENT_FAILED: 'مشکلی در پرداخت پیش آمده، لطفا دوباره امتحان کنید!',
  GENERIC_ERROR: 'مشکلی پیش آمده، لطفا دوباره امتحان کنید!',
  ORDER_ALREADY_PAID: 'Order is already paid',
} as const

// In-memory cache to prevent duplicate processing
// const processingCache = new Map<string, Promise<any>>()

// Utility functions
const createZarinpalInstance = () => {
  const apiKey = process.env.ZARINPAL_KEY
  if (!apiKey) {
    throw new Error('ZARINPAL_KEY environment variable is not set')
  }
  return ZarinPalCheckout.create(apiKey, true)
}

const validatePaymentParameters = (
  orderId: string,
  Authority?: string,
  Status?: string
) => {
  if (!orderId) {
    return { isValid: false, error: ERROR_MESSAGES.ORDER_NOT_FOUND }
  }

  if (
    Authority !== undefined &&
    Status !== undefined &&
    (!Status || !Authority)
  ) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_PAYMENT_RESPONSE }
  }

  return { isValid: true }
}

const findOrderByIdAndUser = async (orderId: string, userId: string) => {
  return await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: userId,
    },
    include: {
      items: true,
      paymentDetails: true,
    },
  })
}

// Helper function to create payment request
async function createPaymentRequest(order: any, orderId: string) {
  const zarinpal = createZarinpalInstance()

  const user = await getCurrentUser()
  if (!user?.phoneNumber) return null
  await checkRateLimit(user.id)

  // Use the new API route for callback
  const callbackURL =
    process.env.NODE_ENV === 'production'
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback?orderId=${orderId}`
      : `http://localhost:3000/api/payment/callback?orderId=${orderId}`

  const payment = (await zarinpal.PaymentRequest({
    Amount: Number(order.total),
    CallbackURL: callbackURL,
    Description: `Payment for order ${orderId}`,
    Mobile: user.phoneNumber,
  })) as PaymentRequestResult

  return payment
}

// Helper function to update order with payment request
async function updateOrderWithPaymentRequest(
  orderId: string,
  userId: string,
  payment: PaymentRequestResult
) {
  await prisma.paymentDetails.upsert({
    where: {
      orderId: orderId,
    },
    update: {
      status: payment.status.toString(),
      Authority: payment.authority,
    },
    create: {
      orderId: orderId,
      userId: userId,
      status: payment.status.toString(),
      Authority: payment.authority,
    },
  })
}

// Main payment request function
export async function zarinpalPayment(
  path: string,
  orderId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formState: ZarinpalPaymentFormState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formData: FormData
): Promise<ZarinpalPaymentFormState> {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user || !user.id) {
      return {
        errors: {
          _form: ['شما اجازه دسترسی ندارید!'],
        },
      }
    }

    // CRITICAL: Check rate limiting
    if (!checkRateLimit(user.id)) {
      return {
        errors: {
          _form: ['تعداد تلاش‌های پرداخت شما بیش از حد مجاز است'],
        },
      }
    }
    const userId = user.id

    // Validate parameters
    const validation = validatePaymentParameters(orderId)
    if (!validation.isValid) {
      return {
        errors: {
          _form: [validation.error!],
        },
      }
    }

    // Find order
    const order = await findOrderByIdAndUser(orderId, userId)
    if (!order) {
      return {
        errors: {
          _form: [ERROR_MESSAGES.ORDER_DELETED],
        },
      }
    }

    // Check if order is already paid
    if (order.paymentStatus === 'Paid') {
      return {
        errors: {
          _form: ['این سفارش قبلاً پرداخت شده است'],
        },
      }
    }

    // await storeOrderIntegrityHash(orderId, order.total, user.id)

    // const zarinpal = ZarinPalCheckout.create(process.env.ZARINPAL_KEY!, true)

    // const callbackURL = `${process.env.PAYMENT_CALLBACK_URL}/order/${orderId}`

    // Create payment request
    const payment = await createPaymentRequest(order, orderId)

    if (!payment) {
      return {
        errors: {
          _form: ['خطا در ایجاد درخواست پرداخت'],
        },
      }
    }

    // Update order with payment request
    await updateOrderWithPaymentRequest(orderId, userId, payment)

    if (payment?.status === PAYMENT_STATUS.SUCCESS) {
      return {
        payment,
        errors: {},
      }
    } else {
      return {
        errors: {
          _form: [ERROR_MESSAGES.PAYMENT_FAILED],
        },
      }
    }
  } catch (error) {
    console.error('Payment request error:', error)
    return {
      errors: {
        _form: [
          error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC_ERROR,
        ],
      },
    }
  } finally {
    revalidatePath(path)
  }
}

export async function zarinpalPaymentApproval(
  path: string,
  orderId: string,
  Authority: string,
  Status: string
) {
  // Clean up expired locks first
  await cleanupExpiredLocks()

  // CRITICAL: Acquire distributed lock
  const lockAcquired = await acquirePaymentLock(orderId, Authority)
  if (!lockAcquired) {
    // console.log('Payment verification already in progress:', orderId)
    return {
      errors: {
        _form: [PaymentError.LockFailed], // Use the error code
      },
    }
  }

  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return {
        errors: {
          _form: [PaymentError.Unauthorized],
        },
      }
    }

    // CRITICAL: Check rate limiting
    if (!checkRateLimit(user.id)) {
      return {
        errors: {
          _form: ['تعداد تلاش‌های پرداخت شما بیش از حد مجاز است'],
        },
      }
    }

    // Get order with latest data
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id,
      },
      include: {
        items: true,
      },
    })

    if (!order) {
      return {
        errors: {
          _form: ['سفارش در دسترس نیست!'],
        },
      }
    }

    // CRITICAL: Double-check payment status with fresh data
    if (order.paymentStatus === 'Paid') {
      // console.log('Order already paid during verification:', orderId)
      return { success: true, alreadyPaid: true }
    }

    // CRITICAL: Validate payment attempt
    const isValidAttempt = await validatePaymentAttempt(
      orderId,
      Authority,
      order.total
    )
    if (!isValidAttempt) {
      return {
        errors: {
          _form: ['درخواست پرداخت نامعتبر است'],
        },
      }
    }

    // CRITICAL: Validate order integrity
    const isOrderValid = await validateOrderIntegrity(orderId, order.total)
    if (!isOrderValid) {
      return {
        errors: {
          _form: ['اطلاعات سفارش نامعتبر است'],
        },
      }
    }

    if (Status === 'OK') {
      const zarinpal = ZarinPalCheckout.create(process.env.ZARINPAL_KEY!, true)

      const verification = (await zarinpal.PaymentVerification({
        Amount: Number(order.total),
        Authority,
      })) as { status: number; refId: number }
      // console.log({ verification })
      if (verification.status === 100) {
        // CRITICAL: Mark authority as used to prevent replay
        await prisma.paymentAttempt.update({
          where: {
            orderId_authority: {
              orderId,
              authority: Authority,
            },
          },
          data: {
            status: 'SUCCESS',
          },
        })

        // Update order to paid with transaction
        await updateOrderToPaidSecure({
          orderId,
          paymentResult: {
            id: verification.refId.toString(),
            status: 'OK',
            authority: Authority,
            fee: order.total.toString(),
          },
        })

        return { success: true }
      } else {
        // Mark as failed
        await prisma.paymentAttempt.update({
          where: {
            orderId_authority: {
              orderId,
              authority: Authority,
            },
          },
          data: {
            status: 'FAILED',
          },
        })

        return {
          errors: {
            _form: ['پرداخت تایید نشد'],
          },
        }
      }
    } else {
      return {
        errors: {
          _form: ['پرداخت لغو شد'],
        },
      }
    }
  } catch (error) {
    console.error('Payment approval error:', error)
    return {
      errors: {
        _form: [PaymentError.ServerError],
      },
    }
  } finally {
    // CRITICAL: Always release the lock
    await releasePaymentLock(orderId)
    revalidatePath(path)
  }
}

// Server action to deliver order (for admin use)
export async function deliverOrder(orderId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED,
      }
    }

    // Check admin authorization
    if (user?.role !== 'admin') {
      return {
        success: false,
        message: 'شما اجازه انجام این عمل را ندارید!',
      }
    }

    const order = await prisma.order.findFirst({
      where: { id: orderId },
    })

    if (!order) {
      return {
        success: false,
        message: ERROR_MESSAGES.ORDER_NOT_FOUND,
      }
    }

    if (order.paymentStatus !== 'Paid') {
      return {
        success: false,
        message: 'سفارش هنوز پرداخت نشده است!',
      }
    }

    if (order.orderStatus === 'Delivered') {
      return {
        success: false,
        message: 'سفارش قبلاً تحویل داده شده است!',
      }
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: 'Delivered',
      },
    })

    revalidatePath(`/order/${orderId}`)

    return {
      success: true,
      message: 'سفارش با موفقیت به عنوان تحویل شده علامت‌گذاری شد!',
    }
  } catch (error) {
    console.error('Deliver order error:', error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC_ERROR,
    }
  }
}

// Server action for COD orders
export async function updateOrderToPaidCOD(orderId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED,
      }
    }

    // Check admin authorization
    if (user?.role !== 'admin') {
      return {
        success: false,
        message: 'شما اجازه انجام این عمل را ندارید!',
      }
    }

    const order = await prisma.order.findFirst({
      where: { id: orderId },
    })

    if (!order) {
      return {
        success: false,
        message: ERROR_MESSAGES.ORDER_NOT_FOUND,
      }
    }

    if (order.paymentStatus === 'Paid') {
      return {
        success: false,
        message: 'سفارش قبلاً پرداخت شده است!',
      }
    }

    await updateOrderToPaidSecure({ orderId })

    revalidatePath(`/order/${orderId}`)

    return {
      success: true,
      message: 'سفارش با موفقیت به عنوان پرداخت شده علامت‌گذاری شد!',
    }
  } catch (error) {
    console.error('Update order to paid COD error:', error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC_ERROR,
    }
  }
}

// Security issues
async function acquirePaymentLock(
  orderId: string,
  authority: string
): Promise<boolean> {
  const lockExpiry = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

  try {
    await prisma.paymentLock.create({
      data: {
        orderId,
        authority,
        expiresAt: lockExpiry,
      },
    })
    return true
  } catch (error) {
    // Lock already exists or other constraint violation
    console.error('Failed to acquire payment lock:', error)
    return false
  }
}

async function releasePaymentLock(orderId: string) {
  try {
    await prisma.paymentLock.delete({
      where: { orderId },
    })
  } catch (error) {
    console.error('Failed to release payment lock:', error)
  }
}

// CRITICAL: Clean up expired locks
async function cleanupExpiredLocks() {
  await prisma.paymentLock.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  })
}

async function validatePaymentAttempt(
  orderId: string,
  authority: string,
  amount: number
): Promise<boolean> {
  // Check if this authority was already used
  const existingAttempt = await prisma.paymentAttempt.findUnique({
    where: {
      orderId_authority: {
        orderId,
        authority,
      },
    },
  })

  if (existingAttempt) {
    if (
      existingAttempt.status === 'SUCCESS' ||
      existingAttempt.status === 'USED'
    ) {
      // console.log('Authority already used:', authority)
      return false
    }
    // Update existing attempt
    await prisma.paymentAttempt.update({
      where: { id: existingAttempt.id },
      data: {
        status: 'PENDING',
        amount,
      },
    })
  } else {
    // Create new attempt record
    await prisma.paymentAttempt.create({
      data: {
        orderId,
        authority,
        amount,
        status: 'PENDING',
      },
    })
  }

  return true
}

// CRITICAL: Validate order hasn't been tampered with
async function validateOrderIntegrity(
  orderId: string,
  expectedAmount: number
): Promise<boolean> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { total: true, userId: true, paymentStatus: true },
  })

  if (!order) return false
  if (order.paymentStatus === 'Paid') return false

  // Ensure amount matches exactly
  if (Math.abs(order.total - expectedAmount) > 0.01) {
    console.error('Payment amount mismatch:', {
      orderId,
      orderTotal: order.total,
      paymentAmount: expectedAmount,
    })
    return false
  }

  return true
}

// CRITICAL: Rate limiting per user
// const userPaymentAttempts = new Map<
//   string,
//   { count: number; resetTime: number }
// >()

// async function checkRateLimit(userId: string) {
//   const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60)

//   const count = await prisma.paymentRateLimit.count({
//     where: {
//       userId,
//       createdAt: { gte: oneHourAgo },
//     },
//   })

//   if (count >= 50) {
//     throw new Error('Too many payment attempts, please try again later.')
//   }

//   await prisma.paymentRateLimit.create({
//     data: { userId },
//   })
// }

// SECURED Order Update Function
// Updated updateOrderToPaidSecure function in payment1.ts
export async function updateOrderToPaidSecure({
  orderId,
  paymentResult,
}: {
  orderId: string
  paymentResult?: any
}) {
  return await prisma.$transaction(async (tx) => {
    // CRITICAL: Use SELECT FOR UPDATE equivalent
    const order = await tx.order.findFirst({
      where: { id: orderId },
      include: { items: true },
    })

    if (!order) {
      throw new Error('Order not found')
    }

    // CRITICAL: Final check for payment status
    if (order.paymentStatus === 'Paid') {
      throw new Error('Order already paid')
    }

    // CRITICAL: Validate inventory before updating
    for (const item of order.items) {
      const currentVariant = await tx.productVariant.findUnique({
        where: {
          // : item.productSlug,
          id: item.variantId,
        },
        select: { quantity: true },
      })

      if (!currentVariant || currentVariant.quantity < item.quantity) {
        throw new Error(`Insufficient inventory for product ${item.variantId}`)
      }
    }

    // Update inventory
    for (const item of order.items) {
      await tx.productVariant.update({
        where: {
          //
          id: item.variantId,
          quantity: { gte: item.quantity },
        },
        data: {
          quantity: { decrement: item.quantity },
        },
      })

      await tx.product.update({
        where: { slug: item.productSlug },
        data: {
          sales: { increment: item.quantity },
        },
      })
    }

    // Mark order as paid
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'Paid',
        paidAt: new Date(), // Set the actual payment date
      },
    })

    // Update payment details with transaction ID
    if (paymentResult) {
      await tx.paymentDetails.upsert({
        where: { orderId },
        update: {
          status: paymentResult.status,
          Authority: paymentResult.authority,
          amount: Number(paymentResult.fee),
          transactionId: paymentResult.id, // Store the refId as transaction ID
        },
        create: {
          orderId,
          userId: order.userId,
          status: paymentResult.status,
          Authority: paymentResult.authority,
          amount: Number(paymentResult.fee),
          transactionId: paymentResult.id, // Store the refId as transaction ID
        },
      })
    }

    return updatedOrder
  })
}

// Function to update order to paid status with race condition protection
// export async function updateOrderToPaid({
//   orderId,
//   paymentResult,
// }: {
//   orderId: string
//   paymentResult?: PaymentResult
// }) {
//   // console.log('Updating order to paid:', { orderId, paymentResult })

//   // Use a database transaction to prevent race conditions
//   return await prisma.$transaction(async (tx) => {
//     // Get order from database with a lock
//     const order = await tx.order.findFirst({
//       where: {
//         id: orderId,
//       },
//       include: {
//         items: true,
//       },
//     })

//     if (!order) {
//       throw new Error('Order not found')
//     }

//     // CRITICAL: Check if order is already paid
//     if (order.paymentStatus === 'Paid') {
//       // console.log('Order already paid during transaction:', orderId)
//       throw new Error(ERROR_MESSAGES.ORDER_ALREADY_PAID)
//     }

//     // Update product stock for each item
//     for (const item of order.items) {
//       await tx.size.update({
//         where: { productId: item.productId, id: item.sizeId },
//         data: {
//           quantity: {
//             decrement: item.quantity,
//           },
//         },
//       })
//       await tx.product.update({
//         where: {
//           id: item.productId,
//         },
//         data: {
//           sales: {
//             increment: item.quantity,
//           },
//         },
//       })
//     }

//     // Mark order as paid
//     const updatedOrder = await tx.order.update({
//       where: { id: orderId },
//       data: {
//         paymentStatus: 'Paid',
//       },
//       include: {
//         items: true,
//         user: { select: { name: true, phoneNumber: true } },
//         paymentDetails: true,
//       },
//     })

//     await tx.paymentDetails.update({
//       where: {
//         orderId: updatedOrder.id,
//       },
//       data: {
//         status: paymentResult?.status,
//         Authority: paymentResult?.authority,
//         amount: Number(paymentResult?.fee),
//       },
//     })

//     // console.log('Order successfully updated to paid:', { orderId })
//     return updatedOrder
//   })
// }

// Helper function to mark payment as failed
// async function markPaymentAsFailed(orderId: string, userId: string) {
//   await prisma.order.update({
//     where: {
//       id: orderId,
//       userId: userId,
//     },
//     data: {
//       paymentStatus: 'Pending',
//     },
//   })
// }

// Helper function to verify successful payment
// async function verifySuccessfulPayment(
//   order: any,
//   Authority: string,
//   orderId: string,
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   path: string
// ) {
//   const zarinpal = createZarinpalInstance()

//   // Additional security check: verify the Authority matches the order's payment result
//   const storedPaymentResult = order.paymentResult as any
//   if (
//     storedPaymentResult?.authority &&
//     storedPaymentResult.authority !== Authority
//   ) {
//     // console.log('Authority mismatch - possible cross-order contamination:', {
//     //   stored: storedPaymentResult.authority,
//     //   received: Authority,
//     //   orderId,
//     // })
//     return {
//       errors: {
//         _form: [ERROR_MESSAGES.INVALID_PAYMENT_INFO],
//       },
//     }
//   }

//   // Double-check order is not already paid (race condition protection)
//   const freshOrder = await prisma.order.findFirst({
//     where: { id: orderId },
//     select: {
//       paymentStatus: true,
//       userId: true,
//     },
//   })

//   if (!freshOrder) {
//     return {
//       errors: {
//         _form: [ERROR_MESSAGES.ORDER_NOT_FOUND],
//       },
//     }
//   }

//   if (freshOrder.paymentStatus === 'Paid') {
//     // console.log('Order was paid during verification process:', orderId)
//     return { success: true, alreadyPaid: true }
//   }

//   const verification = (await zarinpal.PaymentVerification({
//     Amount: Number(order.total),
//     Authority,
//   })) as PaymentVerificationResult

//   // console.log('Payment verification result:', verification)

//   if (verification.status === PAYMENT_STATUS.SUCCESS) {
//     // console.log(`Payment verified! Ref ID: ${verification.refId}`)

//     // Use a transaction to ensure atomicity and prevent race conditions
//     try {
//       await updateOrderToPaid({
//         orderId,
//         paymentResult: {
//           id: verification.refId.toString(),
//           status: PAYMENT_STATUS.OK,
//           authority: Authority,
//           fee: order.total.toString(),
//         },
//       })

//       return { success: true }
//     } catch (error) {
//       // Check if the error is due to order already being paid
//       if (
//         error instanceof Error &&
//         error.message === ERROR_MESSAGES.ORDER_ALREADY_PAID
//       ) {
//         // console.log('Order was already paid during update process')
//         return { success: true, alreadyPaid: true }
//       }
//       throw error
//     }
//   } else {
//     // console.log('Payment verification failed with status:', verification.status)
//     await markPaymentAsFailed(orderId, order.userId)

//     return {
//       errors: {
//         _form: [ERROR_MESSAGES.INVALID_PAYMENT_INFO],
//       },
//     }
//   }
// }

// async function releasePaymentLock(orderId: string) {
//   try {
//     await prisma.paymentLock.delete({
//       where: { orderId },
//     })
//   } catch (error) {
//     console.log('Failed to release payment lock:', error)
//   }
// }

// // CRITICAL: Clean up expired locks
// async function cleanupExpiredLocks() {
//   await prisma.paymentLock.deleteMany({
//     where: {
//       expiresAt: {
//         lt: new Date(),
//       },
//     },
//   })
// }

// Main payment approval function
// export async function zarinpalPaymentApproval(
//   path: string,
//   orderId: string,
//   Authority: string,
//   Status: string
// ) {
//   // Clean up expired locks first
//   await cleanupExpiredLocks()

//   // CRITICAL: Acquire distributed lock
//   const lockAcquired = await acquirePaymentLock(orderId, Authority)
//   if (!lockAcquired) {
//     console.log('Payment verification already in progress:', orderId)
//     return {
//       errors: {
//         _form: ['پرداخت در حال بررسی است، لطفا صبر کنید'],
//       },
//     }
//   }

//   // Create a unique key for this payment verification
//   const cacheKey = `verify-${orderId}-${Authority}`

//   // Check if we're already processing this exact payment
//   if (processingCache.has(cacheKey)) {
//     // console.log('Already processing payment verification for:', cacheKey)
//     try {
//       return await processingCache.get(cacheKey)
//     } catch (error) {
//       processingCache.delete(cacheKey)
//       throw error
//     }
//   }

//   // Create the processing promise
//   const processingPromise = (async () => {
//     try {
//       // console.log('Starting payment approval for:', {
//       //   orderId,
//       //   Authority,
//       //   Status,
//       // })

//       // Get current user
//       const user = await getCurrentUser()
//       if (!user?.id) {
//         return {
//           errors: {
//             _form: [ERROR_MESSAGES.UNAUTHORIZED],
//           },
//         }
//       }

//       // Validate parameters
//       const validation = validatePaymentParameters(orderId, Authority, Status)
//       if (!validation.isValid) {
//         return {
//           errors: {
//             _form: [validation.error!],
//           },
//         }
//       }

//       // Find order - get fresh data from database
//       const order = await findOrderByIdAndUser(orderId, user.id)
//       if (!order) {
//         return {
//           errors: {
//             _form: [ERROR_MESSAGES.ORDER_DELETED],
//           },
//         }
//       }

//       // CRITICAL: Check if order is already paid to prevent double processing
//       if (
//         order.paymentDetails?.status === 'Paid' ||
//         order.paymentStatus === 'Paid'
//       ) {
//         // console.log('Order already paid, skipping verification:', orderId)
//         return { success: true, alreadyPaid: true }
//       }

//       // Handle payment status
//       if (Status === PAYMENT_STATUS.OK) {
//         return await verifySuccessfulPayment(order, Authority, orderId, path)
//       } else if (Status === PAYMENT_STATUS.NOK) {
//         await markPaymentAsFailed(orderId, user.id)
//         return {
//           errors: {
//             _form: [ERROR_MESSAGES.PAYMENT_ERROR],
//           },
//         }
//       }

//       return {
//         errors: {
//           _form: [ERROR_MESSAGES.INVALID_PAYMENT_RESPONSE],
//         },
//       }
//     } catch (error) {
//       console.error('Payment approval error:', error)
//       return {
//         errors: {
//           _form: [
//             error instanceof Error
//               ? error.message
//               : ERROR_MESSAGES.GENERIC_ERROR,
//           ],
//         },
//       }
//     } finally {
//       revalidatePath(path)
//       // Clean up the cache after processing
//       setTimeout(() => {
//         processingCache.delete(cacheKey)
//       }, 5000)
//     }
//   })()

//   // Store the promise in cache
//   processingCache.set(cacheKey, processingPromise)

//   return await processingPromise
// }

// function createOrderHash(
//   orderId: string,
//   amount: number,
//   userId: string
// ): string {
//   return createHash('sha256')
//     .update(`${orderId}-${amount}-${userId}-${process.env.PAYMENT_SECRET}`)
//     .digest('hex')
// }
