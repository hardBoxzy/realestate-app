import { useState } from 'react'

// 物件の新規登録・編集で共用するフォーム
// initialValues が渡された場合は編集モード、渡されない場合は新規登録モードとして動作する
export function PropertyForm({ initialValues, onSubmit, onCancel, isSubmitting }) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [rent, setRent] = useState(initialValues?.rent ?? '')
  const [area, setArea] = useState(initialValues?.area ?? '')
  const [layout, setLayout] = useState(initialValues?.layout ?? '')

  const isEditMode = Boolean(initialValues)

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({
      name: name.trim(),
      rent: Number(rent),
      area: area.trim(),
      layout: layout.trim(),
    })
  }

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <h2>{isEditMode ? '物件を編集' : '物件を新規登録'}</h2>

      <label htmlFor="name">物件名</label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label htmlFor="rent">家賃(円)</label>
      <input
        id="rent"
        type="number"
        min="0"
        value={rent}
        onChange={(e) => setRent(e.target.value)}
        required
      />

      <label htmlFor="area">エリア名</label>
      <input
        id="area"
        type="text"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        required
      />

      <label htmlFor="layout">間取り</label>
      <input
        id="layout"
        type="text"
        placeholder="例: 1LDK"
        value={layout}
        onChange={(e) => setLayout(e.target.value)}
        required
      />

      <div className="property-form-actions">
        <button type="button" className="secondary-button" onClick={onCancel} disabled={isSubmitting}>
          キャンセル
        </button>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '保存中...' : isEditMode ? '更新する' : '登録する'}
        </button>
      </div>
    </form>
  )
}
