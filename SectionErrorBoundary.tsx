import React from "react";

interface Props {
  section: string;
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class SectionErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: "var(--border-radius-lg)",
            padding: "24px",
            textAlign: "center",
            color: "var(--color-text-secondary)",
            fontSize: "13px",
          }}
        >
          <p style={{ margin: "0 0 4px", fontWeight: 500, color: "var(--color-text-primary)" }}>
            Error en sección: {this.props.section}
          </p>
          <p style={{ margin: 0 }}>{this.state.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
