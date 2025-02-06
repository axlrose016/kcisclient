'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EyeIcon, EyeOffIcon } from 'lucide-react'

export default function PasswordFields() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordsMatch, setPasswordsMatch] = useState(true)

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword)
    } else {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setPasswordsMatch(e.target.value === confirmPassword)
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    setPasswordsMatch(password === e.target.value)
  }

  return (
    <>
        <div className="sm:col-span-4">
        <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
          Password
        </label>
        <div className="mt-2 relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            required
            value={password}
            onChange={handlePasswordChange}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => togglePasswordVisibility('password')}
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
            ) : (
              <EyeIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
            )}
          </Button>
        </div>
        </div>
        <div className="sm:col-span-4">
            <label htmlFor="confirm_password" className="block text-sm/6 font-medium text-gray-900">
            Confirm Password
            </label>
            <div className="mt-2 relative">
            <Input
                id="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirm_password"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
            />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => togglePasswordVisibility('confirmPassword')}
            >
                {showConfirmPassword ? (
                <EyeOffIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                ) : (
                <EyeIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                )}
            </Button>
            </div>
        </div>
        {!passwordsMatch && confirmPassword !== '' && (
            <div className="sm:col-span-8">
            <p className="text-sm text-red-500">Passwords do not match</p>
            </div>
        )}
    </>
  )
}

