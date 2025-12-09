import React, { useState, useEffect } from "react";
import { Wrench, Clock, Mail, AlertCircle } from "lucide-react";

export default function Maintenance() {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top_left,rgba(255,106,0,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(26,115,232,0.12),transparent_50%),radial-gradient(ellipse_at_top_right,rgba(0,196,140,0.12),transparent_40%)] overflow-hidden flex items-center justify-center relative bg-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating shapes */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-valasys-orange/25 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-valasys-blue/25 blur-3xl"></div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-3"
          style={{
            backgroundImage:
              "linear-gradient(0deg, transparent 24%, rgba(255,106,0,.03) 25%, rgba(255,106,0,.03) 26%, transparent 27%, transparent 74%, rgba(255,106,0,.03) 75%, rgba(255,106,0,.03) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,106,0,.03) 25%, rgba(255,106,0,.03) 26%, transparent 27%, transparent 74%, rgba(255,106,0,.03) 75%, rgba(255,106,0,.03) 76%, transparent 77%, transparent)",
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-valasys-orange to-valasys-blue rounded-full blur-2xl opacity-30"></div>
            <div className="relative bg-gradient-to-br from-valasys-orange to-valasys-blue p-6 rounded-full">
              <Wrench className="w-12 h-12 text-white animate-spin" style={{animationDuration: '3s'}} />
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-valasys-gray-900 mb-4 tracking-tight">
          Site Under Maintenance
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-valasys-gray-600 mb-8 leading-relaxed">
          We're working hard to bring you an even better experience. Our team is
          currently updating the platform with new features and improvements.
        </p>

        {/* Status Card */}
        <div className="bg-white/60 backdrop-blur-lg border border-valasys-gray-200 rounded-2xl p-6 sm:p-8 mb-8 hover:shadow-lg transition-all duration-300 shadow-md">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-valasys-orange" />
            <span className="text-valasys-gray-700">Maintenance Duration</span>
          </div>
          <div className="font-mono text-3xl font-bold text-valasys-blue mb-4">
            {formatTime(timeElapsed)}
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-valasys-gray-600">
            <AlertCircle className="w-4 h-4" />
            <span>Expected to be back online shortly</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* What's Happening */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Wrench className="w-5 h-5 text-valasys-orange mt-1" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white mb-1">Improvements</h3>
                <p className="text-sm text-valasys-gray-400">
                  We're implementing new features and optimizing performance
                </p>
              </div>
            </div>
          </div>

          {/* Stay Updated */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Mail className="w-5 h-5 text-valasys-blue mt-1" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white mb-1">Stay Updated</h3>
                <p className="text-sm text-valasys-gray-400">
                  Subscribe to receive updates when we're back online
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Email Subscription */}
        <div className="bg-gradient-to-r from-valasys-orange/10 to-valasys-blue/10 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-8">
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-valasys-gray-400 focus:outline-none focus:border-valasys-orange transition-all duration-300 backdrop-blur-sm"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-valasys-orange to-valasys-blue text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-valasys-orange/30 transition-all duration-300 whitespace-nowrap"
            >
              Notify Me
            </button>
          </form>
          <p className="text-xs text-valasys-gray-400 mt-3">
            We'll email you when the site is back online
          </p>
        </div>

        {/* Footer Info */}
        <div className="text-sm text-valasys-gray-400 space-y-2">
          <p>
            If you have any urgent inquiries, please reach out to{" "}
            <a
              href="mailto:support@valasys.com"
              className="text-valasys-orange hover:text-valasys-orange-light transition-colors"
            >
              support@valasys.com
            </a>
          </p>
          <p className="text-xs text-valasys-gray-500">
            Thank you for your patience and support
          </p>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100vh) translateX(100px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
