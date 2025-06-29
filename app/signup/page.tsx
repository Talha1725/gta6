'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/lib/services'
import { validationUtils } from '@/lib/utils/validation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate email
    const emailError = validationUtils.email.getError(email.trim())
    if (emailError) {
      setError(emailError)
      setLoading(false)
      return
    }

    // Validate password
    const passwordError = validationUtils.password.getError(password)
    if (passwordError) {
      setError(passwordError)
      setLoading(false)
      return
    }

    // Validate password confirmation
    const confirmPasswordError = validationUtils.confirmPassword.getError(password, confirmPassword)
    if (confirmPasswordError) {
      setError(confirmPasswordError)
      setLoading(false)
      return
    }

    try {
      const result = await authService.signup({
        email: email.trim(),
        password,
        confirmPassword
      })

      if (!result.success) {
        setError(result.message || 'Signup failed')
      } else {
        // Redirect to login page after successful signup
        router.push('/login?success=1')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-cyan-900">
      <div className="bg-black/40 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-8 shadow-2xl w-full max-w-md">
      <div className="items-center mb-6">
      <button
            type="button"
            onClick={() => router.push('/')}
            className="px-4 py-2 text-white rounded transition"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-center text-white">Sign Up</h2>
          
        </div>        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Email input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-gray-500/30 rounded-xl text-white"
              required
            />
          </div>

          {/* Password input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-gray-500/30 rounded-xl text-white"
              required
            />
          </div>

          {/* Confirm Password input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-gray-500/30 rounded-xl text-white"
              required
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-black font-bold py-3 px-6 rounded-xl transition-all duration-200"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          {/* Sign in link */}
          <p className="text-center text-gray-300 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-cyan-400 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}