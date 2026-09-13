import { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext'
import { supabase } from '../supabaseClient'
import { PropertyForm } from '../components/PropertyForm'

// 物件一覧画面(Supabaseのpropertiesテーブルと連携してCRUDを行う)
export function PropertyList() {
  const { user, signOut } = useAuth()

  const [properties, setProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // フォームの表示状態(false: 非表示 / true: 新規登録 / オブジェクト: 編集対象の物件)
  const [formTarget, setFormTarget] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 物件一覧を取得する(RLSにより自分が登録した物件のみ返ってくる)
  const fetchProperties = async () => {
    setIsLoading(true)
    setErrorMessage('')

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setErrorMessage('物件一覧の取得に失敗しました。')
    } else {
      setProperties(data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  // 新規登録・編集フォームの送信処理
  const handleFormSubmit = async (values) => {
    setIsSubmitting(true)
    setErrorMessage('')

    if (formTarget && formTarget !== true) {
      // 編集モード: 既存の物件をUPDATEする
      const { error } = await supabase
        .from('properties')
        .update(values)
        .eq('id', formTarget.id)

      if (error) {
        setErrorMessage('物件の更新に失敗しました。')
        setIsSubmitting(false)
        return
      }
    } else {
      // 新規登録モード: 自分のuser_idを付与してINSERTする
      const { error } = await supabase
        .from('properties')
        .insert({ ...values, user_id: user.id })

      if (error) {
        setErrorMessage('物件の登録に失敗しました。')
        setIsSubmitting(false)
        return
      }
    }

    setIsSubmitting(false)
    setFormTarget(false)
    await fetchProperties()
  }

  // 物件の削除処理
  const handleDelete = async (property) => {
    const confirmed = window.confirm(`「${property.name}」を削除しますか?`)
    if (!confirmed) return

    const { error } = await supabase.from('properties').delete().eq('id', property.id)

    if (error) {
      setErrorMessage('物件の削除に失敗しました。')
      return
    }

    await fetchProperties()
  }

  return (
    <div className="property-page">
      <header className="property-header">
        <div>
          <h1>物件一覧</h1>
          {user && <p className="logged-in-user">{user.email} でログイン中</p>}
        </div>
        <div className="property-header-actions">
          <button type="button" onClick={() => setFormTarget(true)}>
            物件を登録
          </button>
          <button type="button" className="secondary-button" onClick={signOut}>
            ログアウト
          </button>
        </div>
      </header>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {formTarget && (
        <PropertyForm
          initialValues={formTarget !== true ? formTarget : null}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormTarget(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {isLoading ? (
        <p className="loading">読み込み中...</p>
      ) : properties.length === 0 ? (
        <p className="empty-message">登録されている物件はまだありません。</p>
      ) : (
        <div className="property-grid">
          {properties.map((property) => (
            <div className="property-card" key={property.id}>
              <h2 className="property-name">{property.name}</h2>
              <p className="property-rent">家賃: {property.rent.toLocaleString()}円</p>
              <p className="property-area">エリア: {property.area}</p>
              <p className="property-layout">間取り: {property.layout}</p>
              <div className="property-card-actions">
                <button type="button" className="secondary-button" onClick={() => setFormTarget(property)}>
                  編集
                </button>
                <button type="button" className="danger-button" onClick={() => handleDelete(property)}>
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
