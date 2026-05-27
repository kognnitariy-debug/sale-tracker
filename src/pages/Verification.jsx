import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useUser } from '../context/UserContext'

export default function Verification() {
  const navigate = useNavigate()
  const { user, setVerified } = useUser()
  const [phoneCode, setPhoneCode] = useState('')
  const [emailCode, setEmailCode] = useState('')
  const [phoneSent, setPhoneSent] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [errors, setErrors] = useState({})

  const phone = user?.contact?.phone || '+7 (___) ___-__-__'
  const email = user?.contact?.email || 'your@email.ru'

  function sendPhoneCode() {
    setPhoneSent(true)
    setErrors(e => ({ ...e, phone: undefined }))
  }

  function sendEmailCode() {
    setEmailSent(true)
    setErrors(e => ({ ...e, email: undefined }))
  }

  function verifyPhone() {
    if (phoneCode.length < 4) {
      setErrors(e => ({ ...e, phone: 'Введите 4-значный код' }))
      return
    }
    setPhoneVerified(true)
  }

  function verifyEmail() {
    if (emailCode.length < 4) {
      setErrors(e => ({ ...e, email: 'Введите 4-значный код' }))
      return
    }
    setEmailVerified(true)
  }

  function finish() {
    setVerified(true)
    navigate('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-2)' }}>
      <Header />

      <div className="wrap-sm" style={{ padding: '40px 24px 64px' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, marginBottom: 12 }}>Верификация аккаунта</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 16, lineHeight: 1.65 }}>
            Подтвердите телефон и email — это даёт вам статус верифицированного поставщика
            и открывает расширенные возможности платформы.
          </p>
        </div>

        {/* Why verify */}
        <div className="alert alert-info" style={{ marginBottom: 28 }}>
          <span className="alert-icon">💡</span>
          <div>
            Верифицированные поставщики <strong>в 3 раза чаще</strong> получают отклики от закупщиков.
            Сети видят, что вы — реальная компания, а не фейк.
          </div>
        </div>

        {/* Phone */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={s.verifyHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ ...s.verifyIcon, background: phoneVerified ? 'var(--primary-light)' : '#F3F4F6' }}>
                {phoneVerified ? '✅' : '📱'}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Подтверждение телефона</div>
                <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{phone}</div>
              </div>
            </div>
            {phoneVerified && <span className="badge badge-green">Подтверждён</span>}
          </div>

          {!phoneVerified && (
            <>
              {!phoneSent ? (
                <button className="btn btn-outline btn-block" onClick={sendPhoneCode}>
                  📲 Отправить SMS-код
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <input
                      className={`input${errors.phone ? ' err' : ''}`}
                      placeholder="0000"
                      maxLength={4}
                      value={phoneCode}
                      onChange={e => setPhoneCode(e.target.value.replace(/\D/g, ''))}
                      style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, letterSpacing: 8 }}
                    />
                    {errors.phone && <div className="err-msg">{errors.phone}</div>}
                    <div className="hint" style={{ textAlign: 'center' }}>
                      Для прототипа введите любые 4 цифры
                    </div>
                  </div>
                  <button className="btn btn-primary" onClick={verifyPhone}>
                    Подтвердить
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Email */}
        <div className="card" style={{ marginBottom: 28 }}>
          <div style={s.verifyHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ ...s.verifyIcon, background: emailVerified ? 'var(--primary-light)' : '#F3F4F6' }}>
                {emailVerified ? '✅' : '📧'}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Подтверждение email</div>
                <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{email}</div>
              </div>
            </div>
            {emailVerified && <span className="badge badge-green">Подтверждён</span>}
          </div>

          {!emailVerified && (
            <>
              {!emailSent ? (
                <button className="btn btn-outline btn-block" onClick={sendEmailCode}>
                  ✉️ Отправить код на email
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <input
                      className={`input${errors.email ? ' err' : ''}`}
                      placeholder="0000"
                      maxLength={4}
                      value={emailCode}
                      onChange={e => setEmailCode(e.target.value.replace(/\D/g, ''))}
                      style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, letterSpacing: 8 }}
                    />
                    {errors.email && <div className="err-msg">{errors.email}</div>}
                    <div className="hint" style={{ textAlign: 'center' }}>
                      Для прототипа введите любые 4 цифры
                    </div>
                  </div>
                  <button className="btn btn-primary" onClick={verifyEmail}>
                    Подтвердить
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Progress */}
        <div style={s.progressBar}>
          <div style={{ ...s.progressFill, width: `${(phoneVerified ? 50 : 0) + (emailVerified ? 50 : 0)}%` }} />
        </div>
        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-3)', marginBottom: 24 }}>
          {phoneVerified && emailVerified
            ? '✅ Оба канала подтверждены'
            : `Подтверждено: ${phoneVerified ? 1 : 0} из 2`}
        </div>

        {phoneVerified && emailVerified && (
          <div>
            <div className="alert alert-success" style={{ marginBottom: 20 }}>
              <span className="alert-icon">🎉</span>
              <div>
                <strong>Верификация пройдена!</strong> Теперь вы — верифицированный поставщик.
                Закупщики могут найти вас по категории товаров.
              </div>
            </div>
            <button className="btn btn-primary btn-xl btn-block" onClick={finish}>
              ✓ Вернуться к возможностям →
            </button>
          </div>
        )}

        <div style={s.altChannels}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)', marginBottom: 12 }}>
            Дополнительные каналы связи (получите доступ после верификации):
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['Telegram', 'WhatsApp', 'Zoom'].map(ch => (
              <div key={ch} style={s.channelBadge}>{ch}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  verifyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  verifyIcon: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
  },
  progressBar: {
    height: 6,
    background: 'var(--bg-3)',
    borderRadius: 100,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    background: 'var(--primary)',
    borderRadius: 100,
    transition: 'width .4s ease',
  },
  altChannels: {
    marginTop: 32,
    padding: '20px 24px',
    background: 'var(--bg-3)',
    borderRadius: 'var(--r)',
  },
  channelBadge: {
    padding: '6px 16px',
    background: '#fff',
    border: '1px solid var(--border)',
    borderRadius: 100,
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-3)',
  },
}
