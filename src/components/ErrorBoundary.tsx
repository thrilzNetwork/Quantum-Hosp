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
        <div className="min-h-screen flex items-center justify-center bg-black p-8 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-pink/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />

          <div className="text-center max-w-2xl relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-pink/10 border border-pink/20 rounded-3xl mb-8">
              <div className="w-10 h-10 bg-pink rounded-xl flex items-center justify-center text-black font-black text-2xl">!</div>
            </div>
            <h1 className="text-h3 font-black uppercase tracking-tight text-white mb-6">Something went wrong</h1>
            <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl mb-10 shadow-2xl">
              <p className="text-pink font-mono text-sm break-all leading-relaxed">{errorMessage}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-10 py-5 bg-pink text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-lg shadow-pink/20"
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
