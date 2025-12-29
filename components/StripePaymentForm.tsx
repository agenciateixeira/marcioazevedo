'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'

// Inicializar Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutFormProps {
  amount: number
  email: string
  name: string
  productType: 'resultado' | 'ebook_completo' | 'ebook_simples' | 'mentoria'
  onSuccess: () => void
  onError: (error: string) => void
}

function CheckoutForm({ amount, email, name, productType, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setMessage(null)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?product=${productType}`,
        receipt_email: email,
      },
      redirect: 'if_required',
    })

    if (error) {
      setMessage(error.message || 'Erro ao processar pagamento')
      onError(error.message || 'Erro ao processar pagamento')
      setIsProcessing(false)
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setMessage('Pagamento aprovado! Redirecionando...')
      onSuccess()
    } else {
      setMessage('Processando pagamento...')
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />

      {message && (
        <div className={`p-4 rounded-lg text-sm ${
          message.includes('aprovado')
            ? 'bg-green-50 text-green-800 border border-green-200'
            : message.includes('Erro') || message.includes('erro')
            ? 'bg-red-50 text-red-800 border border-red-200'
            : 'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed shadow-xl text-lg"
      >
        {isProcessing ? 'Processando...' : `Pagar R$ ${amount.toFixed(2)}`}
      </button>

      <p className="text-xs text-center text-gray-500">
        Pagamento 100% seguro processado pelo Stripe
      </p>
    </form>
  )
}

interface StripePaymentFormProps {
  amount: number
  email: string
  name: string
  productType: 'resultado' | 'ebook_completo' | 'ebook_simples' | 'mentoria'
  onSuccess: () => void
  onError?: (error: string) => void
}

export default function StripePaymentForm({
  amount,
  email,
  name,
  productType,
  onSuccess,
  onError = () => {}
}: StripePaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Criar PaymentIntent ao montar o componente
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            email,
            name,
            productType,
          }),
        })

        const data = await response.json()

        if (data.error) {
          setError(data.error)
          setLoading(false)
          return
        }

        setClientSecret(data.clientSecret)
        setLoading(false)
      } catch (err) {
        setError('Erro ao inicializar pagamento')
        setLoading(false)
      }
    }

    createPaymentIntent()
  }, [amount, email, name, productType])

  if (loading) {
    return (
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Preparando pagamento seguro...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
        <p className="text-red-800 font-semibold mb-2">Erro ao carregar pagamento</p>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    )
  }

  if (!clientSecret) {
    return null
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#ec4899',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-8">
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance,
          locale: 'pt-BR',
        }}
      >
        <CheckoutForm
          amount={amount}
          email={email}
          name={name}
          productType={productType}
          onSuccess={onSuccess}
          onError={onError}
        />
      </Elements>
    </div>
  )
}
