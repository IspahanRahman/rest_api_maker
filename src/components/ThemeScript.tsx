/**
 * Theme initialization script to prevent flash of wrong theme
 * This runs BEFORE any React rendering to apply theme immediately
 */
export function ThemeScript() {
	return (
		<script
			dangerouslySetInnerHTML={{
				__html: `
          (function() {
            try {
              const theme = localStorage.getItem('theme') || 'system';
              const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              const root = document.documentElement;

              if (theme === 'dark' || (theme === 'system' && systemPrefersDark)) {
                root.classList.add('dark');
              } else {
                root.classList.remove('dark');
              }
            } catch (e) {
              console.error('Theme initialization failed:', e);
            }
          })();
        `
			}}
		/>
	)
}
