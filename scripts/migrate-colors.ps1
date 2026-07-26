# Global color token migration: Replace all slate/white/gray Tailwind classes with warm design system tokens
# This transforms every page from the AI-dashboard look to the warm brand system

$files = Get-ChildItem -Recurse -Path "d:\AnveshakHub\src" -Include "*.tsx", "*.ts" | Where-Object { $_.FullName -notmatch "\\api\\" }

$replacements = @(
  # Backgrounds
  @{ From = 'className="min-h-screen bg-slate-50'; To = 'className="min-h-screen" style={{ backgroundColor: "var(--bg-app)" }}' },
  @{ From = '"bg-slate-50"'; To = '"" style={{ backgroundColor: "var(--bg-app)" }}' },
  @{ From = 'bg-slate-50 '; To = 'bg-[#FBF7F0] ' },
  @{ From = 'bg-slate-100 '; To = 'bg-[#EFE9DF] ' },
  @{ From = 'bg-white '; To = 'bg-[#FBF7F0] ' },
  @{ From = 'bg-white"'; To = 'bg-[#FBF7F0]"' },
  @{ From = '"bg-white '; To = '"bg-[#FBF7F0] ' },
  
  # Text colors
  @{ From = 'text-slate-900'; To = 'text-[#211F1D]' },
  @{ From = 'text-slate-800'; To = 'text-[#211F1D]' },
  @{ From = 'text-slate-700'; To = 'text-[#211F1D]' },
  @{ From = 'text-slate-600'; To = 'text-[#57534E]' },
  @{ From = 'text-slate-500'; To = 'text-[#78716A]' },
  @{ From = 'text-slate-400'; To = 'text-[#A8A196]' },
  @{ From = 'text-slate-300'; To = 'text-[#D8D2C7]' },

  # Border colors
  @{ From = 'border-slate-200'; To = 'border-[#E2DCD2]' },
  @{ From = 'border-slate-100'; To = 'border-[#E2DCD2]' },
  @{ From = 'border-slate-300'; To = 'border-[#D8D2C7]' },
  
  # Hover
  @{ From = 'hover:bg-slate-50'; To = 'hover:bg-[#EFE9DF]' },
  @{ From = 'hover:bg-slate-100'; To = 'hover:bg-[#E6DFD4]' },
  
  # Divide
  @{ From = 'divide-slate-100'; To = 'divide-[#E2DCD2]' },
  @{ From = 'divide-slate-200'; To = 'divide-[#E2DCD2]' },

  # Shadows
  @{ From = 'shadow-sm'; To = 'shadow-[var(--shadow-sm)]' },

  # bg surfaces
  @{ From = 'bg-slate-50/50'; To = 'bg-[#FBF7F0]' },
  @{ From = 'bg-slate-50/20'; To = 'bg-[#FFF0ED]' },
  
  # Primary color (old blue primary → ember)
  @{ From = 'text-primary'; To = 'text-[#FF5A36]' },
  @{ From = 'bg-primary'; To = 'bg-[#FF5A36]' },
  @{ From = 'hover:bg-primary'; To = 'hover:bg-[#E04826]' },
  @{ From = 'border-primary'; To = 'border-[#FF5A36]' },
  @{ From = 'text-secondary'; To = 'text-[#211F1D]' },
  @{ From = 'bg-secondary'; To = 'bg-[#1C1917]' },
  
  # Success colors
  @{ From = 'text-emerald-'; To = 'text-[#2F6B4F]/' },
  @{ From = 'bg-emerald-50'; To = 'bg-[#E8F2EC]' },
  @{ From = 'text-emerald-700'; To = 'text-[#2F6B4F]' },
  @{ From = 'text-emerald-500'; To = 'text-[#2F6B4F]' },
  @{ From = 'text-emerald-600'; To = 'text-[#2F6B4F]' },
  @{ From = 'text-success'; To = 'text-[#2F6B4F]' },
  @{ From = 'text-green-600'; To = 'text-[#2F6B4F]' },
  @{ From = 'text-green-700'; To = 'text-[#2F6B4F]' },
  
  # Old primary buttons to new design system
  @{ From = '"h-10 px-4 bg-primary hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"'; To = '"btn-primary btn-sm"' },
  @{ From = '"h-10 px-5 bg-primary hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"'; To = '"btn-primary"' },
  
  # Old card styles → design system
  @{ From = '"bg-white border border-slate-200 rounded-2xl shadow-sm p-6"'; To = '"card-flat rounded-2xl p-6"' },
  @{ From = '"bg-white border border-slate-200 rounded-2xl shadow-sm p-5"'; To = '"card-flat rounded-2xl p-5"' },
  @{ From = '"bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"'; To = '"card-flat rounded-2xl overflow-hidden"' },
  
  # Font sizes
  @{ From = 'text-[9px]'; To = 'text-[10px]' }
)

$changedFiles = 0

foreach ($file in $files) {
  $content = Get-Content $file.FullName -Raw -Encoding UTF8
  $original = $content
  
  foreach ($r in $replacements) {
    $content = $content -replace [regex]::Escape($r.From), $r.To
  }
  
  if ($content -ne $original) {
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
    Write-Host "Updated: $($file.FullName)"
    $changedFiles++
  }
}

Write-Host "Total files updated: $changedFiles"
