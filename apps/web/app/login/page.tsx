"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signUp } from '@repo/utils'
import Loading from './loading'

import { User, Lock, Mail, Facebook, Twitter, Linkedin } from "lucide-react"

export default function AuthPage() {
  const [isSignUpMode, setIsSignUpMode] = useState(false)

  const [mount, setmount] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setmount(true);
  }, [])

  if (mount === false) return null;

  async function signin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true)
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl: "/main",
    });

    setLoading(false)


    if (res?.ok) {
      router.push(res.url ?? "/main");
    } else {
      setError("Invalid username or password");
    }
  }

  async function signup(e: React.FormEvent) {

    e.preventDefault();
    setLoading(true);
    const res = await signUp(username,password)

    if (res?.ok) {
      const signInRes = await signIn("credentials", {
        username,
        password,
        redirect: true,
        callbackUrl: "/main",
      }
    );

    setLoading(false);

    if (signInRes && signInRes.error) {
      setError("Failed to sign in after registration. Please log in manually.");
    }
    } else {
      setError("Registration failed. The username might already be taken.");
    }
  }

  if (loading) {
    return <Loading />;
  }
  

  return (
    <div className={`container ${isSignUpMode ? "sign-up-mode" : ""} max-w-full`}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* Sign In Form */}
          <form onSubmit={signin} className="sign-in-form">
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <div className="pt-4 pl-2">
                <User className=" text-black icon" />
              </div>
              <input onChange={(e) => {
                setUsername(e.target.value)
              }} type="text" placeholder="Username" />
            </div>
            <div className="input-field">
              <div className="pt-4 pl-2">
                <Lock className="text-black icon" />
              </div>
              <input
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
                type="password" placeholder="Password" />
            </div>
            <div className={`${error ? "pb-4" : ""}`}>
              {error && (
                <p className="text-[var(--color-error)] font-medium  text-xs ml-2">{error}</p>
              )}
            </div>
            <input type="submit" value="Login" className="btn solid" />
            <p className="social-text">Or Sign in with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-icon">
                <Twitter size={20} />
              </a>
              <a href="#" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </a>
              <a href="#" className="social-icon">
                <Linkedin size={20} />
              </a>
            </div>
          </form>

          {/* Sign Up Form */}
          <form onSubmit={signup}className="sign-up-form">
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <div className="pt-4 pl-2">
                <User className="text-black icon" />
              </div>
              <input 
              onChange={(e)=>{
                setUsername(e.target.value)
              }}
              type="text" placeholder="Username" />
            </div>

            <div className="input-field">
              <div className="pt-4 pl-2">
                <Lock className=" text-black icon" />
              </div>
              <input 
              onChange={(e)=>{
                setPassword(e.target.value)
              }}
              type="password" placeholder="Password" />
            </div>
            <input type="submit" className="btn" value="Sign up" />
            <p className="social-text">Or Sign up with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-icon">
                <Twitter size={20} />
              </a>
              <a href="#" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </a>
              <a href="#" className="social-icon">
                <Linkedin size={20} />
              </a>
            </div>
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content mt-8">
            <h3>New here ?</h3>
            <p>Sign up and never miss a message from your friends and communities.</p>
            <button className="btn transparent" onClick={() => setIsSignUpMode(true)}>
              Sign up
            </button>
          </div>
          <div className="image pl-38">
            <svg width="400" height="400" viewBox="0 0 300 300" fill="none">
              <g transform="translate(50, 50) scale(1)">
                {/* Main chat bubble */}
                <rect x="60" y="80" width="120" height="80" rx="20" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="2" />
                <circle cx="85" cy="110" r="3" fill="#10B981" />
                <circle cx="100" cy="110" r="3" fill="#10B981" />
                <circle cx="115" cy="110" r="3" fill="#10B981" />
                <rect x="75" y="125" width="80" height="3" rx="1.5" fill="#9CA3AF" />
                <rect x="75" y="135" width="60" height="3" rx="1.5" fill="#9CA3AF" />

                {/* Secondary chat bubble */}
                <rect x="20" y="40" width="100" height="60" rx="15" fill="#000000" />
                <rect x="30" y="55" width="60" height="3" rx="1.5" fill="#FFFFFF" />
                <rect x="30" y="65" width="45" height="3" rx="1.5" fill="#FFFFFF" />
                <rect x="30" y="75" width="70" height="3" rx="1.5" fill="#FFFFFF" />

                {/* Mobile phone */}
                <rect x="140" y="120" width="50" height="90" rx="10" fill="#1F2937" />
                <rect x="145" y="130" width="40" height="60" rx="5" fill="#111827" />
                <circle cx="165" cy="200" r="6" fill="#374151" />

                {/* Chat notifications */}
                <circle cx="175" cy="135" r="8" fill="#EF4444" />
                <text x="175" y="140" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                  3
                </text>

                {/* People connecting */}
                <g transform="translate(30, 170)">
                  <circle cx="0" cy="0" r="12" fill="#F59E0B" />
                  <rect x="-8" y="12" width="16" height="20" rx="8" fill="#1F2937" />
                </g>

                <g transform="translate(80, 170)">
                  <circle cx="0" cy="0" r="12" fill="#EF4444" />
                  <rect x="-8" y="12" width="16" height="20" rx="8" fill="#1F2937" />
                </g>

                <g transform="translate(130, 170)">
                  <circle cx="0" cy="0" r="12" fill="#8B5CF6" />
                  <rect x="-8" y="12" width="16" height="20" rx="8" fill="#1F2937" />
                </g>

                {/* Connection lines */}
                <path d="M42 180 Q61 175 68 180" stroke="#10B981" strokeWidth="2" fill="none" />
                <path d="M92 180 Q111 175 118 180" stroke="#10B981" strokeWidth="2" fill="none" />

                {/* Message reactions/emojis */}
                <circle cx="200" cy="60" r="15" fill="#FEF3C7" />
                <text x="200" y="67" textAnchor="middle" fill="white" fontSize="16">
                  😊
                </text>

                <circle cx="170" cy="80" r="12" fill="#DBEAFE" />
                <text x="170" y="86" textAnchor="middle" fontSize="14">
                  👍
                </text>

                <circle cx="190" cy="100" r="10" fill="#FEE2E2" />
                <text x="190" y="106" textAnchor="middle" fontSize="12">
                  ❤️
                </text>

                {/* WiFi/connection symbol */}
                <g transform="translate(10, 10)">
                  <path d="M0 20 Q10 10 20 20" stroke="#10B981" strokeWidth="2" fill="none" />
                  <path d="M5 20 Q10 15 15 20" stroke="#10B981" strokeWidth="2" fill="none" />
                  <circle cx="10" cy="20" r="2" fill="#10B981" />
                </g>
              </g>
            </svg>
          </div>
        </div>

        <div className="panel right-panel max-w-full">
          <div className="content ml-30 mt-10">
            <h3>One of us ?</h3>
            <p>Log in to see what your friends are up to and keep the conversation going.</p>
            <button className="btn transparent" onClick={() => setIsSignUpMode(false)}>
              Sign in
            </button>
          </div>
          <div className="image">
            <svg width="400" height="400" viewBox="0 0 300 300" fill="none">
              <g transform="translate(50, 50) scale(1)">
                {/* Group chat bubble */}
                <rect x="60" y="60" width="140" height="100" rx="25" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="2" />

                {/* Multiple user avatars in group */}
                <circle cx="90" cy="90" r="15" fill="#F59E0B" />
                <circle cx="130" cy="90" r="15" fill="#EF4444" />
                <circle cx="170" cy="90" r="15" fill="#8B5CF6" />

                {/* Group message lines */}
                <rect x="80" y="115" width="60" height="3" rx="1.5" fill="#9CA3AF" />
                <rect x="80" y="125" width="80" height="3" rx="1.5" fill="#9CA3AF" />
                <rect x="80" y="135" width="45" height="3" rx="1.5" fill="#9CA3AF" />

                {/* Welcome message */}
                <rect x="20" y="20" width="120" height="50" rx="15" fill="#000000" />
                <text x="80" y="35" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                  Welcome!
                </text>
                <text x="80" y="50" textAnchor="middle" fill="white" fontSize="8">
                  Join the conversation
                </text>

                {/* Community icons */}
                <g transform="translate(30, 180)">
                  <circle cx="0" cy="0" r="20" fill="#10B981" />
                  <text x="0" y="6" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
                    +
                  </text>
                </g>

                {/* Online status indicators */}
                <circle cx="102" cy="78" r="4" fill="#10B981" />
                <circle cx="142" cy="78" r="4" fill="#10B981" />
                <circle cx="182" cy="78" r="4" fill="#F59E0B" />

                {/* Message count/activity */}
                <rect x="150" y="170" width="60" height="40" rx="10" fill="#1F2937" />
                <text x="180" y="185" textAnchor="middle" fill="white" fontSize="10">
                  1.2k
                </text>
                <text x="180" y="200" textAnchor="middle" fill="#9CA3AF" fontSize="8">
                  messages
                </text>

                {/* Network connections */}
                <path
                  d="M90 105 Q115 120 130 105"
                  stroke="#10B981"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="3,3"
                />
                <path
                  d="M130 105 Q155 120 170 105"
                  stroke="#10B981"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="3,3"
                />

                {/* Chat features icons */}
                <g transform="translate(180, 20)">
                  <rect x="0" y="0" width="25" height="25" rx="5" fill="#DBEAFE" />
                  <text x="12.5" y="16" textAnchor="middle" fontSize="12">
                    📷
                  </text>
                </g>

                <g transform="translate(180, 50)">
                  <rect x="0" y="0" width="25" height="25" rx="5" fill="#FEE2E2" />
                  <text x="12.5" y="16" textAnchor="middle" fontSize="12">
                    🎵
                  </text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          position: absolute;
          width: 100vw;
          background-color: #8774E1;
          height: 100vh;
          overflow: hidden;
        }

        .forms-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .signin-signup {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          left: 75%;
          width: 50%;
          transition: 1s 0.7s ease-in-out;
          display: grid;
          grid-template-columns: 1fr;
          z-index: 5;
        }

        form {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0rem 5rem;
          transition: all 0.2s 0.7s;
          overflow: hidden;
          grid-column: 1 / 2;
          grid-row: 1 / 2;
        }

        form.sign-up-form {
          opacity: 0;
          z-index: 1;
        }

        form.sign-in-form {
          z-index: 2;
        }

        .title {
          font-size: 2.2rem;
          color: #fff;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .input-field {
          max-width: 380px;
          width: 100%;
          background-color: #fff;
          margin: 10px 0;
          height: 55px;
          border-radius: 55px;
          display: grid;
          grid-template-columns: 15% 85%;
          padding: 0 0.4rem;
          position: relative;
        }

        .input-field .icon {
          text-align: center;
          line-height: 55px;
          color: #8774E1;
          transition: 0.5s;
          font-size: 1.1rem;
          margin: auto;
        }

        .input-field input {
          background: none;
          outline: none;
          border: none;
          line-height: 1;
          font-weight: 600;
          font-size: 1.1rem;
          color: #333;
        }

        .input-field input::placeholder {
          color: #8774E1;
          font-weight: 500;
        }

        .social-text {
          padding: 0.7rem 0;
          font-size: 1rem;
          color: #fff;
        }

        .social-media {
          display: flex;
          justify-content: center;
        }

        .social-icon {
          height: 46px;
          width: 46px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 0.45rem;
          color: #fff;
          border-radius: 50%;
          border: 1px solid #fff;
          text-decoration: none;
          font-size: 1.1rem;
          transition: 0.3s;
        }

        .social-icon:hover {
          color: #8774E1;
          background-color: #fff;
          border-color: #fff;
        }

        .btn {
          width: 150px;
          background-color: #fff;
          border: none;
          outline: none;
          height: 49px;
          border-radius: 49px;
          color: #8774E1;
          text-transform: uppercase;
          font-weight: 600;
          margin: 10px 0;
          cursor: pointer;
          transition: 0.5s;
        }

        .btn:hover {
          background-color: #f0f0f0;
        }

        .panels-container {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }

        .container:before {
          content: "";
          position: absolute;
          height: 2200px;
          width: 2200px;
          top: -15%;
          right: 46%;
          transform: translateY(-50%);
          background-image: linear-gradient(-45deg, #212121 0%, #2a2a2a 100%);
          transition: 1.8s ease-in-out;
          border-radius: 50%;
          z-index: 6;
        }

        .image {
          width: 100%;
          transition: transform 1.1s ease-in-out;
          transition-delay: 0.4s;
        }

        .panel {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-around;
          text-align: center;
          z-index: 6;
        }

        .left-panel {
          pointer-events: all;
          padding: 3rem 17% 2rem 12%;
        }

        .right-panel {
          pointer-events: none;
          padding: 3rem 12% 2rem 17%;
        }

        .panel .content {
          color: #fff;
          transition: transform 0.9s ease-in-out;
          transition-delay: 0.6s;
        }

        .panel h3 {
          font-weight: 600;
          line-height: 1;
          font-size: 1.5rem;
        }

        .panel p {
          font-size: 0.95rem;
          padding: 0.7rem 0;
        }

        .btn.transparent {
          margin: 0;
          background: none;
          border: 2px solid #fff;
          width: 130px;
          height: 41px;
          font-weight: 600;
          font-size: 0.8rem;
          color: #fff;
        }

        .btn.transparent:hover {
          background-color: #fff;
          color: #8774E1;
        }

        .right-panel .image,
        .right-panel .content {
          transform: translateX(800px);
        }

        /* ANIMATION */
        .container.sign-up-mode:before {
          transform: translate(105%, -50%);
          right: 54%;
        }

        .container.sign-up-mode .left-panel .image,
        .container.sign-up-mode .left-panel .content {
          transform: translateX(-800px);
        }

        .container.sign-up-mode .signin-signup {
          left: 25%;
        }

        .container.sign-up-mode form.sign-up-form {
          opacity: 1;
          z-index: 2;
        }

        .container.sign-up-mode form.sign-in-form {
          opacity: 0;
          z-index: 1;
        }

        .container.sign-up-mode .right-panel .image,
        .container.sign-up-mode .right-panel .content {
          transform: translateX(0%);
        }

        .container.sign-up-mode .left-panel {
          pointer-events: none;
        }

        .container.sign-up-mode .right-panel {
          pointer-events: all;
        }

        @media (max-width: 870px) {
          .container {
            height: 100vh;
            width: 100vw;
          }
          .signin-signup {
            width: 100%;
            top: 95%;
            transform: translate(-50%, -100%);
            transition: 1s 0.8s ease-in-out;
          }

          .signin-signup,
          .container.sign-up-mode .signin-signup {
            left: 50%;
          }

          .panels-container {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 2fr 1fr;
          }

          .panel {
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            padding: 2.5rem 8%;
            grid-column: 1 / 2;
          }

          .right-panel {
            grid-row: 3 / 4;
          }

          .left-panel {
            grid-row: 1 / 2;
          }

          .image {
            width: 200px;
            transition: transform 0.9s ease-in-out;
            transition-delay: 0.6s;
          }

          .panel .content {
            padding-right: 15%;
            transition: transform 0.9s ease-in-out;
            transition-delay: 0.8s;
          }

          .panel h3 {
            font-size: 1.2rem;
          }

          .panel p {
            font-size: 0.7rem;
            padding: 0.5rem 0;
          }

          .btn.transparent {
            width: 110px;
            height: 35px;
            font-size: 0.7rem;
          }

          .container:before {
            width: 1700px;
            height: 1700px;
            transform: translateX(-50%);
            left: 30%;
            bottom: 70%;
            right: initial;
            top: initial;
            transition: 2s ease-in-out;
          }

          .container.sign-up-mode:before {
            transform: translate(-50%, 105%);
            bottom: 30%;
            right: initial;
          }

          .container.sign-up-mode .left-panel .image,
          .container.sign-up-mode .left-panel .content {
            transform: translateY(-300px);
          }

          .container.sign-up-mode .right-panel .image,
          .container.sign-up-mode .right-panel .content {
            transform: translateY(0px);
          }

          .right-panel .image,
          .right-panel .content {
            transform: translateY(300px);
          }

          .container.sign-up-mode .signin-signup {
            top: 5%;
            transform: translate(-50%, 0);
          }
        }

        @media (max-width: 570px) {
          form {
            padding: 0 1.5rem;
          }

          .image {
            display: none;
          }
          .panel .content {
            padding: 0.5rem 1rem;
          }
          .container {
            padding: 1.5rem;
            width: 100vw;
            height: 100vh;
          }

          .container:before {
            bottom: 74%;
            left: 50%;
          }

          .container.sign-up-mode:before {
            bottom: 26%;
            left: 50%;
          }
        }
      `}</style>
    </div>
  )
}
