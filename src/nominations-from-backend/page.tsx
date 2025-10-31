import { useEffect, useMemo, useState } from 'react'
import CustomButton from '../screens/CustomButton'
import { ENV_CONFIG } from '../config/env'

type SortOrder = 'asc' | 'desc'

type NominationsResponse = {
  data: any[]
  pagination: { page: number, limit: number, total: number, totalPages: number }
  sort?: Record<string, number>
  filter?: Record<string, unknown>
}

const defaultParams = {
  page: 1,
  limit: 20,
  sortBy: 'submittedAt',
  sortOrder: 'desc' as SortOrder,
  search: '',
  status: '',
  paymentStatus: '',
  dateFrom: '',
  dateTo: ''
}

const buildQueryString = (params: Record<string, unknown>) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    if (typeof value === 'string' && value.trim() === '') return
    query.set(key, String(value))
  })
  return query.toString()
}

export default function NominationsFromBackendPage() {
  const [params, setParams] = useState(defaultParams)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<NominationsResponse | null>(null)
  const [authorized, setAuthorized] = useState(false)
  const [authPassword, setAuthPassword] = useState('')

  const columns = useMemo(() => [
    { key: 'submittedAt', label: 'Submitted At' },
    { key: 'status', label: 'Status' },
    { key: 'paymentStatus', label: 'Payment Status' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'designation', label: 'Designation' },
    { key: 'customerEmail', label: 'Customer Email' },
    { key: 'companyName', label: 'Company' },
    { key: 'category', label: 'Category' },
    { key: 'tradeLicense', label: 'Trade License' },
    { key: 'supportingDocument', label: 'Supporting Document(s)' },
    { key: 'transactionId', label: 'Transaction ID' }
  ], [])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const qs = buildQueryString(params)
      const res = await fetch(`${ENV_CONFIG.API_BASE_URL}/api/nominations?${qs}`)
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const json = await res.json()
      setResponse(json)
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authorized) return
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorized])

  // Auto-fetch when pagination changes so Prev/Next work immediately
  useEffect(() => {
    if (!authorized) return
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.limit, authorized])

  const onAuthorize = () => {
    if (authPassword === 'G^%64n3s') {
      setAuthorized(true)
      setError(null)
    } else {
      setError('Invalid password')
    }
  }

  const onInputChange = (field: keyof typeof defaultParams, value: string) => {
    setParams(prev => ({ ...prev, page: 1, [field]: value }))
  }

  const formatDate = (value: any) => {
    if (!value) return ''
    try { return new Date(value).toLocaleString() } catch { return String(value) }
  }

  const renderCell = (key: string, raw: any) => {
    if (key === 'submittedAt' || key === 'createdAt') return formatDate(raw)
    if (!raw) return ''
    if (key === 'tradeLicense' || key === 'supportingDocument') {
      const value = String(raw)
      const urls = value.split(',').map(s => s.trim()).filter(Boolean)
      if (urls.length === 0) return ''
      if (urls.length === 1) return (
        <a href={urls[0]} target="_blank" rel="noreferrer" className="text-[var(--secondary-color)] underline">View</a>
      )
      return (
        <span>
          <a href={urls[0]} target="_blank" rel="noreferrer" className="text-[var(--secondary-color)] underline">View 1</a>
          {urls.slice(1).map((u, i) => (
            <>
              {', '}
              <a key={i} href={u} target="_blank" rel="noreferrer" className="text-[var(--secondary-color)] underline">View {i + 2}</a>
            </>
          ))}
        </span>
      )
    }
    return String(raw ?? '')
  }

  const page = response?.pagination.page || params.page
  const totalPages = response?.pagination.totalPages || 1

  return (
    <div className="px-standard-mobile-padding sm:px-standard-tablet-padding lg:px-standard-desktop-padding 2xl:px-standard-xl-padding py-8">
      {!authorized && (
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-md p-6 text-slate-800">
          <h2 className="text-lg font-semibold mb-2 text-[var(--secondary-color)]">Enter password</h2>
          <input autoFocus type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder="Password" className="w-full rounded-md px-3 py-2 bg-white border border-slate-300 placeholder-slate-500 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)]/40 mb-3" />
          {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
          <CustomButton onClick={onAuthorize} className="w-full">Continue</CustomButton>
        </div>
      )}
      {authorized && (
      <>
      <h1 className="text-2xl font-semibold mb-4 text-[var(--secondary-color)]">Nominations (from backend)</h1>

      <div className="bg-white border border-slate-200 rounded-md p-4 mb-4 text-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input value={params.search} onChange={e => onInputChange('search', e.target.value)} placeholder="Search" className="w-full rounded-md px-3 py-2 bg-white border border-slate-300 placeholder-slate-500 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)]/40" />
          <input type="date" value={params.dateFrom} onChange={e => onInputChange('dateFrom', e.target.value)} className="w-full rounded-md px-3 py-2 bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)]/40" />
          <input type="date" value={params.dateTo} onChange={e => onInputChange('dateTo', e.target.value)} className="w-full rounded-md px-3 py-2 bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)]/40" />

          <select value={params.status} onChange={e => onInputChange('status', e.target.value)} className="w-full rounded-md px-3 py-2 bg-white border border-slate-300 text-slate-800 focus:outline-none">
            <option value="">Status (any)</option>
            <option value="unpaid">unpaid</option>
            <option value="paid">paid</option>
            <option value="submitted">submitted</option>
          </select>
          <select value={params.paymentStatus} onChange={e => onInputChange('paymentStatus', e.target.value)} className="w-full rounded-md px-3 py-2 bg-white border border-slate-300 text-slate-800 focus:outline-none">
            <option value="">Payment Status (any)</option>
            <option value="completed">completed</option>
            <option value="failed">failed</option>
            <option value="pending">pending</option>
          </select>
          <div className="flex gap-2">
            <select value={params.sortBy} onChange={e => onInputChange('sortBy', e.target.value)} className="flex-1 rounded-md px-3 py-2 bg-white border border-slate-300 text-slate-800 focus:outline-none">
              <option value="submittedAt">submittedAt</option>
              <option value="createdAt">createdAt</option>
            </select>
            <select value={params.sortOrder} onChange={e => onInputChange('sortOrder', e.target.value)} className="w-28 rounded-md px-3 py-2 bg-white border border-slate-300 text-slate-800 focus:outline-none">
              <option value="desc">desc</option>
              <option value="asc">asc</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <CustomButton onClick={fetchData} disabled={loading} className="!disabled:opacity-50 min-w-24 text-center">
            {loading ? 'Loading...' : 'Apply'}
          </CustomButton>
          <CustomButton onClick={() => { setParams(defaultParams); }} variant="outline">
            Reset
          </CustomButton>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-md overflow-x-auto">
        <table className="min-w-full text-[13px] sm:text-sm text-slate-800">
          <thead>
            <tr className="text-left bg-slate-50">
              {columns.map(col => (
                <th key={col.key} className="px-3 py-2 border-b border-slate-200 font-semibold text-slate-700">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {response?.data?.length ? response.data.map((row: any, idx: number) => (
              <tr key={idx} className="odd:bg-slate-50/60">
                {columns.map(col => (
                  <td key={String(col.key)} className="px-3 py-2 border-b border-slate-100 text-slate-800">
                    {renderCell(String(col.key), row[col.key])}
                  </td>
                ))}
              </tr>
            )) : (
              <tr>
                <td className="px-3 py-6 text-center text-slate-700" colSpan={columns.length}>{loading ? 'Loading...' : (error || 'No records')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-slate-800">
        <div className="flex items-center gap-2">
          <CustomButton variant="outline" disabled={page <= 1 || loading} onClick={() => setParams(p => ({ ...p, page: Math.max(1, page - 1) }))} className="!disabled:opacity-50">Prev</CustomButton>
          <span className="text-sm text-slate-700">Page {page} of {totalPages}</span>
          <CustomButton variant="outline" disabled={page >= totalPages || loading} onClick={() => setParams(p => ({ ...p, page: page + 1 }))} className="!disabled:opacity-50">Next</CustomButton>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700">Limit</span>
          <select value={params.limit} onChange={e => setParams(p => ({ ...p, page: 1, limit: Number(e.target.value) }))} className="rounded-md px-3 py-2 bg-white border border-slate-300 text-slate-800">
            {[10,20,50,100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
      </>
      )}
    </div>
  )
}


