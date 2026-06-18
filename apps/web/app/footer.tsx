
import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--footer-bg)',
      color: 'var(--text-muted)',
      padding: '3rem 2rem',
      marginTop: '2rem',
      borderTop: '1px solid var(--footer-border)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem'
      }}>
        
        {/* 1. Company Name + Copyright */}
        <div>
          <h3 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>
            ZedTech Solutions Ltd.
          </h3>
          <p>© 2026 ZedTech Solutions Ltd. All rights reserved.</p>
        </div>

        {/* 2. Trademarks & Associated Companies */}
        <div>
          <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>Legal</h4>
          <p style={{ fontSize: '0.9rem' }}>
            ZedTech™ and ZedCloud™ are trademarks of ZedTech Solutions Ltd.
          </p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Partners: <span style={{ color: 'var(--secondary)' }}>Meta, AWS</span>
          </p>
        </div>

        {/* 3. Contact Information */}
        <div>
          <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>Contact Support</h4>
          <p>Email: support@zedtech.co.zm</p>
          <p>Phone: +260 211 123 456</p>
          <p>Lusaka, Zambia</p>
        </div>

        {/* 4. Social Media Platforms */}
        <div>
          <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>Follow Us</h4>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="https://twitter.com/zedtechzm">Twitter</Link>
            <Link href="https://facebook.com/zedtechzm">Facebook</Link>
            <Link href="https://linkedin.com/company/zedtechzm">LinkedIn</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}