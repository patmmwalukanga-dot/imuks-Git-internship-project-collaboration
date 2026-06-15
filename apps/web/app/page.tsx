// @ts-nocheck
"use client";

import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loginRejected, setLoginRejected] = useState(false);

  // Password requirement checks
  const pwChecks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^a-zA-Z0-9]/.test(password),
  };
  const pwScore = Object.values(pwChecks).filter(Boolean).length;

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very strong"][pwScore];
  const strengthColor = ["", "#E24B4A", "#EF9F27", "#EF9F27", "#1D9E75", "#1D9E75"][pwScore];

  // Email validation — must end with @gmail.com
  const validateEmail = (value) => {
    if (!value) return "Email is required";
    if (!value.endsWith("@gmail.com")) return "Email must end with @gmail.com";
    return "";
  };

  // Password validation
  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    if (!/[a-z]/.test(value)) return "Add a lowercase letter";
    if (!/[A-Z]/.test(value)) return "Add an uppercase letter";
    if (!/[0-9]/.test(value)) return "Add a number";
    if (!/[^a-zA-Z0-9]/.test(value)) return "Add a symbol (e.g. !@#$)";
    return "";
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = { ...errors };
    if (field === "email") newErrors.email = validateEmail(email);
    if (field === "password") newErrors.password = validatePassword(password);
    if (field === "username" && !username) newErrors.username = "Username is required";
    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {
      username: username ? "" : "Username is required",
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(newErrors);
    setTouched({ username: true, email: true, password: true });

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (!hasErrors) {
      // All validations pass — show rejection message (simulating wrong password)
      setLoginRejected(true);
      setPassword("");
    }
  };

  const inputClass = (field) =>
    `w-full h-10 px-3 rounded-lg text-sm border outline-none transition-all ${
      touched[field] && errors[field]
        ? "border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-sm shadow-sm">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <span className="font-medium text-gray-900">SecureLogin</span>
        </div>

        <h1 className="text-xl font-medium text-gray-900 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to continue to your account</p>

        <form onSubmit={handleSubmit} noValidate>

          {/* Username — case sensitive */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value); // stored as-is (case sensitive)
                if (errors.username) setErrors({ ...errors, username: "" });
              }}
              onBlur={() => handleBlur("username")}
              placeholder="Enter your username"
              autoComplete="username"
              className={inputClass("username")}
            />
            {touched.username && errors.username ? (
              <p className="text-xs text-red-500 mt-1">{errors.username}</p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">
                Case-sensitive — &ldquo;John&rdquo; and &ldquo;john&rdquo; are different accounts
              </p>
            )}
          </div>

          {/* Email — must end with @gmail.com */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (touched.email) setErrors({ ...errors, email: validateEmail(e.target.value) });
              }}
              onBlur={() => handleBlur("email")}
              placeholder="you@gmail.com"
              autoComplete="email"
              className={inputClass("email")}
            />
            {touched.email && errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
            {touched.email && !errors.email && email && (
              <p className="text-xs text-green-600 mt-1">Valid email address ✓</p>
            )}
          </div>

          {/* Password — 8+ chars, mixed character types */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLoginRejected(false);
                  if (touched.password) setErrors({ ...errors, password: validatePassword(e.target.value) });
                }}
                onBlur={() => handleBlur("password")}
                placeholder="Enter your password"
                autoComplete="current-password"
                className={`${inputClass("password")} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {/* Strength bars */}
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex-1 h-1 rounded-full transition-all"
                      style={{ background: i <= pwScore ? strengthColor : "#E5E7EB" }}
                    />
                  ))}
                </div>
                <p className="text-xs" style={{ color: strengthColor }}>
                  {strengthLabel}
                </p>
              </div>
            )}

            {/* Requirements checklist */}
            {(touched.password || password) && (
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2">
                {[
                  { key: "length", label: "8+ characters" },
                  { key: "lowercase", label: "Lowercase letter" },
                  { key: "uppercase", label: "Uppercase letter" },
                  { key: "number", label: "Number" },
                  { key: "symbol", label: "Symbol (e.g. !@#$)" },
                ].map(({ key, label }) => (
                  <span
                    key={key}
                    className={`text-xs flex items-center gap-1 ${
                      pwChecks[key] ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {pwChecks[key] ? "✓" : "○"} {label}
                  </span>
                ))}
              </div>
            )}

            {touched.password && errors.password && !password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Red rejection banner — shown when password is wrong */}
          {loginRejected && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mt-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A32D2D" strokeWidth="2" className="flex-shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span className="text-sm text-red-800">
                Incorrect password. Please try again.
              </span>
            </div>
          )}

          <button
            type="submit"
            className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg mt-5 transition-colors active:scale-[0.99]"
          >
            Sign in
          </button>
        </form>

        <div className="flex items-center gap-2 my-4">
          <hr className="flex-1 border-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <hr className="flex-1 border-gray-200" />
        </div>

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-indigo-600 font-medium hover:underline">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
