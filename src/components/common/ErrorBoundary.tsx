import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  componentStack: string | null
  showDetails: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, componentStack: null, showDetails: false }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[Prato ErrorBoundary] Caught error:', error, info.componentStack)
    this.setState({ componentStack: info.componentStack })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const { error, componentStack, showDetails } = this.state
    return (
      <div
        style={{
          padding: '2rem',
          backgroundColor: 'var(--color-error-bg)',
          borderTop: '3px solid var(--color-error-text)',
          borderRadius: '0.5rem',
          margin: '1rem',
        }}
      >
        <h2 style={{ color: 'var(--color-error-text)', marginBottom: '0.5rem' }}>
          Er is een fout opgetreden
        </h2>
        <p style={{ fontFamily: 'monospace', color: 'var(--color-error-text)' }}>
          {error?.message}
        </p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() =>
              this.setState({ hasError: false, error: null, componentStack: null })
            }
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
            }}
          >
            Opnieuw proberen
          </button>
          {import.meta.env.DEV && (
            <button
              onClick={() => this.setState((s) => ({ showDetails: !s.showDetails }))}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'transparent',
                color: 'var(--color-error-text)',
                border: '1px solid var(--color-error-text)',
                borderRadius: '0.375rem',
                cursor: 'pointer',
              }}
            >
              {showDetails ? 'Verberg details' : 'Toon details'}
            </button>
          )}
        </div>
        {showDetails && componentStack && (
          <pre
            style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#1a1a1a',
              color: '#f8f8f8',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
            }}
          >
            {componentStack}
          </pre>
        )}
      </div>
    )
  }
}
