import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

// 会員登録画面
export function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setIsSubmitting(true)

    const { data, error } = await supabase.auth.signUp({ email, password })

    setIsSubmitting(false)

    if (error) {
      setErrorMessage('会員登録に失敗しました。入力内容をご確認ください。')
      return
    }

    // メール確認が必要な設定の場合はセッションが発行されないため、その旨を案内する
    if (!data.session) {
      setSuccessMessage('確認メールを送信しました。メール内のリンクから登録を完了してください。')
      return
    }

    navigate('/properties')
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>会員登録</h1>

        <label htmlFor="email">メールアドレス</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">パスワード</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '登録中...' : '会員登録'}
        </button>

        <p className="auth-switch">
          すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
        </p>
      </form>
    </div>
  )
}
