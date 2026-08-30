import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#171310",
        padding: 20,
      }}
    >
      <LoginForm />
    </div>
  );
}
