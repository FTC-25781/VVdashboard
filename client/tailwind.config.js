/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
const {
  default: flattenColorPalette,
} = require('tailwindcss/lib/util/flattenColorPalette');
const colors = require('tailwindcss/colors');

// Delete deprecated colors to suppress build warnings
// https://github.com/tailwindlabs/tailwindcss/issues/4690
delete colors['lightBlue'];
delete colors['warmGray'];
delete colors['trueGray'];
delete colors['coolGray'];
delete colors['blueGray'];

function hex2rgb(hex) {
  const bigint = parseInt(hex.replace('#', ''), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  darkMode: ['class', 'class'],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				'100': 'rgb(var(--color-primary-100) / <alpha-value>)',
  				'200': 'rgb(var(--color-primary-200) / <alpha-value>)',
  				'300': 'rgb(var(--color-primary-300) / <alpha-value>)',
  				'400': 'rgb(var(--color-primary-400) / <alpha-value>)',
  				'500': 'rgb(var(--color-primary-500) / <alpha-value>)',
  				'600': 'rgb(var(--color-primary-600) / <alpha-value>)',
  				'700': 'rgb(var(--color-primary-700) / <alpha-value>)',
  				'800': 'rgb(var(--color-primary-800) / <alpha-value>)',
  				'900': 'rgb(var(--color-primary-900) / <alpha-value>)',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
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
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Roboto'
  			]
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
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },

  // Prevent '.set-theme-color' classes from being pruned
  safelist: Object.entries(colors)
    .filter(([k, v]) => typeof v !== 'string' && k !== 'primary')
    .map(([k, _]) => `set-theme-${k}`),
  plugins: [
    require('@tailwindcss/forms'),
    plugin(function ({ theme, addComponents }) {
      // .set-theme-color plugin
      const colors = theme('colors');

      const setThemeProperties = Object.entries(colors).reduce(
        (acc, [key, value]) => {
          if (typeof value !== 'string' && key !== 'primary') {
            acc[`.set-theme-${key}`] = Object.entries(value).reduce(
              (acc, [k, v]) => {
                acc[`--color-primary-${k}`] = hex2rgb(v).join(' ');
                return acc;
              },
              {},
            );
          }

          return acc;
        },
        {},
      );

      addComponents(setThemeProperties);
    }),
    function ({ matchUtilities, theme }) {
      // .highlight plugin
      // gives a slight shimmer to buttons
      matchUtilities(
        {
          highlight: (value) => ({ boxShadow: `inset 0 1px 0 0 ${value}` }),
        },
        {
          values: flattenColorPalette(theme('backgroundColor')),
          type: 'color',
        },
      );
    },
      require("tailwindcss-animate")
],
};
