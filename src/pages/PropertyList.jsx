import { useAuth } from '../AuthContext'

// 物件一覧画面(ダミーデータを表示)
const DUMMY_PROPERTIES = [
  { id: 1, name: 'サンライズマンション101', rent: 85000, area: '東京都渋谷区' },
  { id: 2, name: 'グリーンハイツ203', rent: 62000, area: '東京都世田谷区' },
  { id: 3, name: 'パークサイド新宿305', rent: 120000, area: '東京都新宿区' },
  { id: 4, name: 'ベイビュータワー802', rent: 145000, area: '神奈川県横浜市' },
  { id: 5, name: 'リバーサイド庵1F', rent: 55000, area: '東京都杉並区' },
  { id: 6, name: 'コーポ桜丘202', rent: 68000, area: '東京都目黒区' },
]

export function PropertyList() {
  const { user, signOut } = useAuth()

  return (
    <div className="property-page">
      <header className="property-header">
        <div>
          <h1>物件一覧</h1>
          {user && <p className="logged-in-user">{user.email} でログイン中</p>}
        </div>
        <button type="button" onClick={signOut}>
          ログアウト
        </button>
      </header>

      <div className="property-grid">
        {DUMMY_PROPERTIES.map((property) => (
          <div className="property-card" key={property.id}>
            <h2 className="property-name">{property.name}</h2>
            <p className="property-rent">家賃: {property.rent.toLocaleString()}円</p>
            <p className="property-area">エリア: {property.area}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
