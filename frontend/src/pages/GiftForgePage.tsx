/**
 * GiftForge Page - Gift Creation MVP
 * 
 * A joyful gift creation experience with:
 * - 5 beautiful templates
 * - Interactive questionnaire
 * - Live preview
 * - AI generation
 * - Unique shareable links
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface GiftTemplate {
  id: number
  name: string
  description: string
  category: string
  preview_image: string
  questionnaire_fields: {
    fields: Array<{
      id: string
      label: string
      type: string
      required: boolean
      placeholder?: string
      options?: string[]
    }>
  }
  display_order: number
}

interface Gift {
  id: number
  unique_code: string
  template_id: number
  recipient_name: string
  occasion: string
  custom_message?: string
  generated_content?: string
  generation_status: string
  payment_status: string
  created_at: string
}

type Step = 'welcome' | 'templates' | 'questionnaire' | 'preview' | 'generating' | 'payment' | 'complete' | 'view'

export function GiftForgePage() {
  const navigate = useNavigate()
  const { code } = useParams<{ code?: string }>()
  
  const [step, setStep] = useState<Step>('welcome')
  const [templates, setTemplates] = useState<GiftTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<GiftTemplate | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [currentGift, setCurrentGift] = useState<Gift | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If code is in URL, we're viewing a gift
  useEffect(() => {
    if (code) {
      loadGiftByCode(code)
    }
  }, [code])

  // Load templates
  useEffect(() => {
    if (!code && step !== 'view') {
      loadTemplates()
    }
  }, [code, step])

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/gifts/templates')
      if (!response.ok) throw new Error('Failed to load templates')
      const data = await response.json()
      setTemplates(data)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const loadGiftByCode = async (giftCode: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/gifts/view/${giftCode}`)
      if (!response.ok) throw new Error('Gift not found')
      const data = await response.json()
      setCurrentGift(data as any)
      setStep('view')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTemplateSelect = (template: GiftTemplate) => {
    setSelectedTemplate(template)
    setStep('questionnaire')
  }

  const handleFormChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
  }

  const handleQuestionnaireSubmit = async () => {
    if (!selectedTemplate) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/gifts/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: selectedTemplate.id,
          recipient_name: formData.recipient_name || '',
          occasion: selectedTemplate.category,
          custom_message: formData.custom_message || '',
          questionnaire_data: formData
        })
      })
      
      if (!response.ok) throw new Error('Failed to create gift')
      
      const gift = await response.json()
      setCurrentGift(gift)
      setStep('preview')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateContent = async () => {
    if (!currentGift) return
    
    setStep('generating')
    setLoading(true)
    
    try {
      const response = await fetch('/api/gifts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gift_id: currentGift.id })
      })
      
      if (!response.ok) throw new Error('Generation failed')
      
      const updatedGift = await response.json()
      setCurrentGift(updatedGift)
      
      if (updatedGift.generation_status === 'rejected') {
        setError('Content was flagged by our safety filter. Please try different wording.')
        setStep('questionnaire')
      } else {
        setStep('payment')
      }
    } catch (err: any) {
      setError(err.message)
      setStep('preview')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!currentGift) return
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/gifts/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gift_id: currentGift.id,
          payment_method: 'credit_card',
          amount: 4.99
        })
      })
      
      if (!response.ok) throw new Error('Payment failed')
      
      const updatedGift = await response.json()
      setCurrentGift(updatedGift)
      setStep('complete')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getShareableLink = () => {
    if (!currentGift) return ''
    return `${window.location.origin}/giftforge/${currentGift.unique_code}`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareableLink())
    alert('Link copied to clipboard! 🎉')
  }

  // Render different steps
  if (loading && step === 'view') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your gift...</p>
        </div>
      </div>
    )
  }

  if (step === 'view' && currentGift) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-purple-200">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-purple-600 mb-2">
                🎁 A Gift For You!
              </h1>
              <p className="text-xl text-gray-600">To: {currentGift.recipient_name}</p>
            </div>
            
            {currentGift.generation_status === 'completed' && currentGift.generated_content ? (
              <div className="prose prose-lg max-w-none">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                  <pre className="whitespace-pre-wrap font-serif text-gray-800">
                    {currentGift.generated_content}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">This gift is being prepared...</p>
              </div>
            )}
            
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/giftforge')}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition"
              >
                Create Your Own Gift 🎨
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center px-4">
        <div className="max-w-3xl w-full text-center space-y-8 animate-fade-in">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            🎁 GiftForge
          </h1>
          <p className="text-2xl text-gray-700 font-medium">
            Create beautiful, personalized gifts in minutes
          </p>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Choose from 5 stunning templates, answer a few questions, and watch AI craft the perfect message
          </p>
          <button
            onClick={() => setStep('templates')}
            className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-full text-xl font-semibold hover:scale-105 transform transition shadow-lg hover:shadow-xl"
          >
            Start Creating ✨
            <span className="inline-block group-hover:translate-x-1 transition-transform ml-2">→</span>
          </button>
          <div className="pt-8 flex items-center justify-center space-x-8 text-gray-600">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⚡</span>
              <span>Quick & Easy</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎨</span>
              <span>Beautiful</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💝</span>
              <span>Shareable</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'templates') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Template</h2>
            <p className="text-gray-600 text-lg">Select the perfect template for your occasion</p>
          </div>
          
          {error && (
            <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden text-left"
              >
                <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-6xl">
                  {template.category === 'birthday' && '🎂'}
                  {template.category === 'thank_you' && '💝'}
                  {template.category === 'anniversary' && '💑'}
                  {template.category === 'congratulations' && '🎉'}
                  {template.category === 'get_well' && '🌺'}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition">
                    {template.name}
                  </h3>
                  <p className="text-gray-600">{template.description}</p>
                  <div className="mt-4 inline-flex items-center text-purple-600 font-semibold">
                    Choose Template
                    <span className="inline-block group-hover:translate-x-1 transition-transform ml-2">→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button
              onClick={() => setStep('welcome')}
              className="text-gray-600 hover:text-gray-800 underline"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'questionnaire' && selectedTemplate) {
    const fields = selectedTemplate.questionnaire_fields.fields
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Tell us about your gift
              </h2>
              <p className="text-gray-600">We'll use this to create something special</p>
            </div>
            
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            <form onSubmit={(e) => { e.preventDefault(); handleQuestionnaireSubmit() }} className="space-y-6">
              {fields.map((field) => (
                <div key={field.id}>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={formData[field.id] || ''}
                      onChange={(e) => handleFormChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                    />
                  )}
                  
                  {field.type === 'number' && (
                    <input
                      type="number"
                      value={formData[field.id] || ''}
                      onChange={(e) => handleFormChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                    />
                  )}
                  
                  {field.type === 'select' && field.options && (
                    <select
                      value={formData[field.id] || ''}
                      onChange={(e) => handleFormChange(field.id, e.target.value)}
                      required={field.required}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
                    >
                      <option value="">Select...</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                  
                  {field.type === 'textarea' && (
                    <textarea
                      value={formData[field.id] || ''}
                      onChange={(e) => handleFormChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition resize-none"
                    />
                  )}
                </div>
              ))}
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep('templates')}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:scale-105 transform transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {loading ? 'Creating...' : 'Continue →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'preview' && currentGift) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Preview Your Gift
            </h2>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-8">
              <p className="text-gray-700 mb-2"><strong>To:</strong> {currentGift.recipient_name}</p>
              <p className="text-gray-700 mb-2"><strong>Occasion:</strong> {currentGift.occasion}</p>
              {currentGift.custom_message && (
                <p className="text-gray-700 mt-4"><strong>Your Message:</strong><br/>{currentGift.custom_message}</p>
              )}
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-6">Ready to generate your personalized gift?</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setStep('questionnaire')}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  ← Edit
                </button>
                <button
                  onClick={handleGenerateContent}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:scale-105 transform transition shadow-lg disabled:opacity-50 font-semibold"
                >
                  Generate ✨
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'generating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-purple-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center text-4xl">
              ✨
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            Creating your gift...
          </h3>
          <p className="text-gray-600 animate-pulse">
            Our AI is crafting something special just for you
          </p>
        </div>
      </div>
    )
  }

  if (step === 'payment' && currentGift) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Almost There! 🎉
            </h2>
            
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-8">
              <p className="text-green-800 text-center font-semibold">
                ✓ Your gift has been generated successfully!
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-8">
              <h3 className="font-bold text-gray-800 mb-3">Preview:</h3>
              <div className="text-gray-700 text-sm whitespace-pre-wrap">
                {currentGift.generated_content?.substring(0, 200)}...
              </div>
            </div>
            
            <div className="border-t-2 border-gray-200 pt-6 mb-8">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span className="text-purple-600">$4.99</span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Complete your order to unlock the shareable link
              </p>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg hover:scale-105 transform transition shadow-lg disabled:opacity-50 font-bold text-lg"
              >
                {loading ? 'Processing...' : 'Complete Order ($4.99) →'}
              </button>
              <p className="text-sm text-gray-500 mt-4">
                🔒 Secure stub payment (demo mode)
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'complete' && currentGift) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Your Gift is Ready!
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Share this magical link with {currentGift.recipient_name}
            </p>
            
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg mb-8">
              <p className="text-sm text-gray-600 mb-2">Shareable Link:</p>
              <div className="bg-white p-4 rounded-lg border-2 border-purple-300 break-all font-mono text-sm">
                {getShareableLink()}
              </div>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={copyToClipboard}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg hover:scale-105 transform transition shadow-lg font-bold"
              >
                📋 Copy Link
              </button>
              
              <button
                onClick={() => window.open(getShareableLink(), '_blank')}
                className="w-full border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-lg hover:bg-purple-50 transition font-semibold"
              >
                👀 Preview Gift
              </button>
              
              <button
                onClick={() => {
                  setStep('welcome')
                  setSelectedTemplate(null)
                  setFormData({})
                  setCurrentGift(null)
                }}
                className="w-full text-gray-600 hover:text-gray-800 underline"
              >
                Create Another Gift
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
