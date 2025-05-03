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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// EcoBloom colorset
				eco: {
					leaf: '#28a745',
					darkLeaf: '#1e7e34',
					forest: '#1b2735',
					water: '#1e90ff',
					ground: '#8b4513',
					lightGround: '#deb887',
					sky: '#87ceeb',
					deepSky: '#4682b4',
					night: '#191970',
					deepNight: '#000080',
					gold: '#ffd700',
					coral: '#ff6347',
					sunset: '#ff4500',
				}
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
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'scale-up': {
					'0%': { transform: 'scale(0)', opacity: '0' },
					'60%': { transform: 'scale(1.1)', opacity: '1' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'glow': {
					'0%, 100%': { boxShadow: '0 0 5px rgba(40, 167, 69, 0.5)' },
					'50%': { boxShadow: '0 0 20px rgba(40, 167, 69, 0.8)' }
				},
				'raindrops': {
					'0%': { transform: 'translateY(-100px)', opacity: '0' },
					'70%': { opacity: '1' },
					'100%': { transform: 'translateY(100vh)', opacity: '0' }
				},
				'wind': {
					'0%': { transform: 'translateX(0)' },
					'25%': { transform: 'translateX(5px)' },
					'50%': { transform: 'translateX(-5px)' },
					'75%': { transform: 'translateX(3px)' },
					'100%': { transform: 'translateX(0)' }
				},
				'pulse-grow': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.1)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'badge-unlock': {
					'0%': { transform: 'scale(0.5)', opacity: '0' },
					'25%': { transform: 'scale(1.2)', opacity: '1' },
					'50%': { transform: 'scale(0.9)', opacity: '1' },
					'75%': { transform: 'scale(1.1)', opacity: '1' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'sparkle': {
					'0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
					'50%': { opacity: '1', transform: 'scale(1.2)' }
				},
				'bounce-up': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-20px)' }
				},
				'notification': {
					'0%': { transform: 'scale(0.5)', opacity: '0' },
					'10%': { transform: 'scale(1.1)', opacity: '1' },
					'20%': { transform: 'scale(1)', opacity: '1' },
					'80%': { transform: 'scale(1)', opacity: '1' },
					'90%': { transform: 'scale(1.1)', opacity: '1' },
					'100%': { transform: 'scale(0.5)', opacity: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'scale-up': 'scale-up 0.5s ease-out forwards',
				'glow': 'glow 2s ease-in-out infinite',
				'raindrops': 'raindrops 2s linear',
				'wind': 'wind 2s ease-in-out infinite',
				'pulse-grow': 'pulse-grow 1.5s ease-in-out infinite',
				'shimmer': 'shimmer 2s infinite linear',
				'sparkle': 'sparkle 2s infinite',
				'bounce-up': 'bounce-up 0.5s ease-out',
				'notification': 'notification 2.5s ease-in-out',
				'badge-unlock': 'badge-unlock 1s ease-out forwards'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
