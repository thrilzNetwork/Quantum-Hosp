import React, { ErrorInfo } from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred. Please refresh the page to try again.";
      let firestoreError = null;

      if (this.state.error) {
        try {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.operationType) {
            firestoreError = parsed;
            errorMessage = `Firestore ${parsed.operationType} error on path: ${parsed.path || 'unknown'}. ${parsed.error}`;
          }
        } catch (e) {
          errorMessage = this.state.error.message;
        }
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
          <div className="text-center max-w-2xl">
            <h1 className="text-4xl font-bold text-black mb-4">Something went wrong</h1>
            <div className="bg-red-50 border border-red-100 p-6 rounded-2xl mb-8">
              <p className="text-red-600 font-mono text-sm break-all">{errorMessage}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="btn bg-black text-white px-8 py-4 rounded-full font-bold"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
