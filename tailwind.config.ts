
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' },
				},
				'shimmer': {
					'0%': { backgroundPosition: '-500px 0' },
					'100%': { backgroundPosition: '500px 0' }
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'ping-slow': {
					'75%, 100%': { transform: 'scale(1.5)', opacity: '0' }
				},
				'float-horizontal': {
					'0%, 100%': { transform: 'translateX(0)' },
					'50%': { transform: 'translateX(10px)' }
				},
				'typing': {
					'0%, 100%': { width: '0%' },
					'50%': { width: '100%' }
				},
				'blink': {
					'0%, 100%': { borderColor: 'transparent' },
					'50%': { borderColor: 'currentColor' }
				},
				'glow': {
					'0%, 100%': { boxShadow: '0 0 5px rgba(123, 97, 255, 0.3), 0 0 10px rgba(123, 97, 255, 0.2)' },
					'50%': { boxShadow: '0 0 20px rgba(123, 97, 255, 0.6), 0 0 30px rgba(123, 97, 255, 0.4)' }
				},
				'flip': {
					'0%': { transform: 'perspective(400px) rotateY(0)' },
					'100%': { transform: 'perspective(400px) rotateY(360deg)' }
				},
				'wave': {
					'0%': { transform: 'rotate(0deg)' },
					'10%': { transform: 'rotate(14deg)' },
					'20%': { transform: 'rotate(-8deg)' },
					'30%': { transform: 'rotate(14deg)' },
					'40%': { transform: 'rotate(-4deg)' },
					'50%': { transform: 'rotate(10deg)' },
					'60%, 100%': { transform: 'rotate(0deg)' }
				},
				'shooting-star': {
					'0%': { transform: 'translateX(0) translateY(0) rotate(-45deg)', opacity: '1' },
					'100%': { transform: 'translateX(1000px) translateY(1000px) rotate(-45deg)', opacity: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-slow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
				'spin-slow': 'spin-slow 8s linear infinite',
				'ping-slow': 'ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
				'float-horizontal': 'float-horizontal 3s ease-in-out infinite',
				'typing': 'typing 3.5s steps(40, end) infinite, blink .75s step-end infinite',
				'glow': 'glow 2s ease-in-out infinite',
				'flip': 'flip 6s linear infinite',
				'wave': 'wave 2.5s infinite',
				'shooting-star': 'shooting-star 2s linear forwards'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
