import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Brain,
  Waves,
  Moon,
  Clock,
  Volume2,
  Sparkles,
  ExternalLink,
  Check,
  Activity,
  Layers,
  HeartPulse,
} from 'lucide-react';
import { ThemeConfig, WeatherSettings } from '../types';

interface SleepScienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
  onApplyPreset?: (settings: Partial<WeatherSettings>, timerMinutes?: number) => void;
}

type ScienceTab = 'masking' | 'delta' | 'stochastic' | 'fadeout' | 'hygiene';

export const SleepScienceModal: React.FC<SleepScienceModalProps> = ({
  isOpen,
  onClose,
  theme,
  onApplyPreset,
}) => {
  const [activeTab, setActiveTab] = useState<ScienceTab>('masking');
  const [appliedNotification, setAppliedNotification] = useState<boolean>(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApplyOptimal = () => {
    if (onApplyPreset) {
      onApplyPreset(
        {
          rainType: 'heavy-downpour',
          rainVolume: 0.82,
          thunderVolume: 0.38,
          thunderIntervalSeconds: 45,
          dropletPatterVolume: 0.45,
          subBassWarmth: 0.65,
          masterVolume: 0.75,
        },
        45
      );
      setAppliedNotification(true);
      setTimeout(() => setAppliedNotification(false), 3000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sleep-science-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#1e2128] border border-[#343946] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-[#c9ced8]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#2d323f] flex items-center justify-between bg-[#191b21]">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center border"
              style={{
                backgroundColor: theme.activeBg,
                borderColor: theme.borderHex,
                color: theme.colorHex,
              }}
            >
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 id="sleep-science-title" className="text-base sm:text-lg font-semibold text-[#dfe3eb] tracking-tight flex items-center gap-2">
                <span>The Science of Sleep Acoustics</span>
                <span
                  className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: theme.activeBg,
                    borderColor: theme.borderHex,
                    color: theme.colorHex,
                  }}
                >
                  Clinical Insights
                </span>
              </h2>
              <p className="text-xs text-[#8a91a1]">
                How sound masking, pink-noise spectrums, and natural acoustics facilitate deep slow-wave sleep.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#242730] hover:bg-[#2e3340] border border-[#363b48] flex items-center justify-center text-[#8e95a5] hover:text-[#dfe3eb] transition-colors cursor-pointer"
            aria-label="Close sleep science modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center overflow-x-auto border-b border-[#2d323f] bg-[#1a1c22] px-3 sm:px-5 py-1.5 gap-1.5 scrollbar-thin">
          {[
            { id: 'masking', label: 'Pink Noise & Masking', icon: Waves },
            { id: 'delta', label: 'Slow-Wave Delta Entrainment', icon: Activity },
            { id: 'stochastic', label: 'Natural Thunder Jitter', icon: Sparkles },
            { id: 'fadeout', label: 'Sleep Cycles & Fade-Out', icon: Clock },
            { id: 'hygiene', label: 'Acoustic Setup Guide', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as ScienceTab)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#262a35] text-[#dfe3eb] shadow-xs'
                    : 'text-[#848c9e] hover:text-[#c4cad7] hover:bg-[#20232c]'
                }`}
                style={isActive ? { color: theme.colorHex, borderBottom: `2px solid ${theme.colorHex}` } : undefined}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs sm:text-sm leading-relaxed">
          {/* TAB 1: ACOUSTIC MASKING & PINK NOISE */}
          {activeTab === 'masking' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-[#16181f] p-4 rounded-xl border border-[#2b303d] space-y-2">
                <span className="text-[11px] font-mono text-[#8a91a1] uppercase tracking-wider flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-[#c89254]" />
                  Acoustic Physics: 1/f Power Spectrum
                </span>
                <h3 className="text-base font-semibold text-[#dfe3eb]">
                  Why Rainfall Outperforms Generic White Noise
                </h3>
                <p className="text-xs text-[#a0a7b7] leading-relaxed">
                  Unlike harsh <em>white noise</em> (which contains equal energy across all raw frequencies and can sound like high-pitched hiss or television static), authentic rainfall naturally conforms to a <strong>pink noise (1/f) frequency profile</strong>. In pink noise, energy decreases by 3 dB per octave, mimicking the natural acoustic attenuation of the human ear and outdoor atmospheric sound.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="bg-[#1a1c23] p-4 rounded-xl border border-[#2c313f] space-y-2">
                  <h4 className="font-semibold text-[#dfe3eb] flex items-center gap-2 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Raising the Auditory Arousal Threshold
                  </h4>
                  <p className="text-xs text-[#8e95a5]">
                    During light sleep (Stage N1 and N2), the brain’s reticular activating system (RAS) constantly scans the bedroom for threat indicators. Sudden transients—such as a car door, barking dog, elevator chime, or creaking floorboard—trigger micro-awakenings. Continuous rain creates a high acoustic floor that masks these spike variations before they wake you.
                  </p>
                </div>

                <div className="bg-[#1a1c23] p-4 rounded-xl border border-[#2c313f] space-y-2">
                  <h4 className="font-semibold text-[#dfe3eb] flex items-center gap-2 text-xs">
                    <HeartPulse className="w-4 h-4 text-rose-400" />
                    Biophilic Amygdala Down-Regulation
                  </h4>
                  <p className="text-xs text-[#8e95a5]">
                    Evolutionary psychologists hypothesize that rain sound triggers an instinctive ancestral cue: large predators seek shelter during heavy storms. Hearing steady rainfall signals environmental safety, prompting the autonomic nervous system to down-regulate sympathetic arousal and activate the parasympathetic vagal response.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#222631] border border-[#343a49] flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-[#181a20] text-amber-400 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-[#dfe3eb]">
                    Research Reference (Frontiers in Human Neuroscience):
                  </div>
                  <p className="text-[11px] text-[#939baa]">
                    Studies (Zhou et al., 2012) demonstrated that steady pink noise exposure significantly reduced nocturnal brainwave complexity and increased sleep stability, with 75% of participants reporting deeper, more refreshing sleep.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DELTA WAVE ENTRAINMENT */}
          {activeTab === 'delta' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-[#16181f] p-4 rounded-xl border border-[#2b303d] space-y-2">
                <span className="text-[11px] font-mono text-[#8a91a1] uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                  Neurological Mechanism
                </span>
                <h3 className="text-base font-semibold text-[#dfe3eb]">
                  Slow-Wave Delta Synchronization (0.5 – 4 Hz)
                </h3>
                <p className="text-xs text-[#a0a7b7] leading-relaxed">
                  Deep sleep (Stage N3, or Slow-Wave Sleep) is characterized by synchronized electroencephalographic (EEG) delta waves oscillating below 4 Hz. This stage is critical for cellular repair, growth hormone release, memory consolidation, and glymphatic brain detoxification.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#1a1c23] border border-[#2c313f] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#dfe3eb]">1. Droplet Rhythmic Regularity</span>
                    <span className="text-[10px] font-mono text-[#7e8697]">Cortical Phase-Locking</span>
                  </div>
                  <p className="text-xs text-[#8e95a5]">
                    Micro-patter and droplet acoustics produce soft, non-intrusive rhythmic pulses. The auditory cortex entrains to these subtle temporal rhythms, facilitating an easier transition from active beta/alpha states into meditative theta and restful delta patterns.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#1a1c23] border border-[#2c313f] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#dfe3eb]">2. Sub-Bass Warmth (&lt; 80 Hz)</span>
                    <span className="text-[10px] font-mono text-[#7e8697]">Somatic Resonance</span>
                  </div>
                  <p className="text-xs text-[#8e95a5]">
                    SlumberRain features an adjustable Sub-Bass Warmth filter. Gentle low-frequency rumblings below 80 Hz create a grounding physical resonance that relaxes muscle tension without presenting high-frequency transients that cause cognitive vigilance.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#1a1c23] border border-[#2c313f] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#dfe3eb]">3. Preventing Micro-Arousals</span>
                    <span className="text-[10px] font-mono text-[#7e8697]">Sleep Continuity</span>
                  </div>
                  <p className="text-xs text-[#8e95a5]">
                    Normal sleep is punctuated by 10 to 20 brief micro-arousals per hour, often unnoticed but fragmenting sleep architecture. Masking sounds reduce arousal frequency, helping keep the sleeper in continuous deep cycles.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STOCHASTIC NATURAL THUNDER JITTER */}
          {activeTab === 'stochastic' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-[#16181f] p-4 rounded-xl border border-[#2b303d] space-y-2">
                <span className="text-[11px] font-mono text-[#8a91a1] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Anti-Loop Technology
                </span>
                <h3 className="text-base font-semibold text-[#dfe3eb]">
                  Why Predictable Loops Keep You Awake
                </h3>
                <p className="text-xs text-[#a0a7b7] leading-relaxed">
                  The human brain is an unparalleled pattern-recognition engine. When listening to standard sleep tracks that loop every 30 or 60 seconds, your subconscious mind begins predicting each transient. This anticipatory focus prevents true cognitive detachment.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="bg-[#1a1c23] p-4 rounded-xl border border-[#2c313f] space-y-2">
                  <div className="font-semibold text-xs text-[#dfe3eb] flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    SlumberRain Stochastic Timing
                  </div>
                  <p className="text-xs text-[#8e95a5]">
                    Our thunder engine introduces randomized Gaussian timing jitter (15s to 90s). The brain cannot build an anticipatory model, allowing the auditory processing center to relax into passive listening.
                  </p>
                </div>

                <div className="bg-[#1a1c23] p-4 rounded-xl border border-[#2c313f] space-y-2">
                  <div className="font-semibold text-xs text-[#dfe3eb] flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    Soft Transient Roll vs. Violent Crack
                  </div>
                  <p className="text-xs text-[#8e95a5]">
                    Sharp lightning strikes trigger the acoustic startle reflex (orbicularis oculi contraction and sympathetic spike). SlumberRain filters out sharp snaps, focusing entirely on low, distant rolling acoustic thunder.
                  </p>
                </div>
              </div>

              <div className="bg-[#1c1f28] p-4 rounded-xl border border-[#2e3340] space-y-2">
                <h4 className="font-semibold text-xs text-[#dfe3eb]">Different Rain Textures for Different Sleepers</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#8e95a5]">
                  <div className="p-2.5 rounded-lg bg-[#16181e] border border-[#272b36]">
                    <strong className="text-[#c9ced8]">Heavy Downpour:</strong> Highest masking capability for city dwellers and loud apartment buildings.
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#16181e] border border-[#272b36]">
                    <strong className="text-[#c9ced8]">City Rooftop / Tin Roof:</strong> Rhythmic high-frequency resonance soothing for tinnitus sufferers.
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#16181e] border border-[#272b36]">
                    <strong className="text-[#c9ced8]">Tent Fabric:</strong> Warm, low-mid enclosed resonance providing a deep cozy sensation.
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#16181e] border border-[#272b36]">
                    <strong className="text-[#c9ced8]">Forest Foliage:</strong> Natural acoustic scattering ideal for light, meditative naps.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SLEEP CYCLES & FADE-OUT */}
          {activeTab === 'fadeout' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-[#16181f] p-4 rounded-xl border border-[#2b303d] space-y-2">
                <span className="text-[11px] font-mono text-[#8a91a1] uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  Sleep Architecture Timing
                </span>
                <h3 className="text-base font-semibold text-[#dfe3eb]">
                  The 45–60 Minute Sleep Window & Contrast Awakenings
                </h3>
                <p className="text-xs text-[#a0a7b7] leading-relaxed">
                  A complete human sleep cycle lasts approximately 90 minutes. The initial descent from wakefulness (N1) to light sleep (N2) takes 15–30 minutes, followed by the first deep slow-wave period (N3) starting around minute 40–50.
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-[#1a1c23] p-4 rounded-xl border border-[#2c313f] space-y-2">
                  <h4 className="font-semibold text-xs text-[#dfe3eb] flex items-center gap-2">
                    <Moon className="w-4 h-4 text-amber-300" />
                    Why Abrupt Sound Termination Wakes You
                  </h4>
                  <p className="text-xs text-[#8e95a5]">
                    The brain does not stop processing sound when you fall asleep. When sound suddenly cuts from 50 dB to silence (such as when a music track finishes or a generic timer clicks off), the auditory cortex registers this rapid delta as a possible emergency, causing an instantaneous spike in heart rate and micro-arousal.
                  </p>
                </div>

                <div className="bg-[#1a1c23] p-4 rounded-xl border border-[#2c313f] space-y-2">
                  <h4 className="font-semibold text-xs text-[#dfe3eb] flex items-center gap-2">
                    <Waves className="w-4 h-4 text-emerald-400" />
                    SlumberRain Exponential Volume Decay
                  </h4>
                  <p className="text-xs text-[#8e95a5]">
                    Rather than a linear decrease, SlumberRain applies a smooth psychoacoustic curve over 1 to 5 minutes before timer expiry. Because human loudness perception is logarithmic, this exponential taper allows your hearing to gently habituate to silence without conscious awareness.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ACOUSTIC SETUP & SLEEP HYGIENE GUIDE */}
          {activeTab === 'hygiene' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-[#16181f] p-4 rounded-xl border border-[#2b303d] space-y-2">
                <span className="text-[11px] font-mono text-[#8a91a1] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Clinical Recommendations
                </span>
                <h3 className="text-base font-semibold text-[#dfe3eb]">
                  Optimal Bedroom Sound & Lighting Configuration
                </h3>
                <p className="text-xs text-[#a0a7b7] leading-relaxed">
                  Guidelines derived from the World Health Organization (WHO), American Academy of Sleep Medicine (AASM), and National Sleep Foundation for safe and restorative acoustic environments.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#1a1c23] p-3.5 rounded-xl border border-[#2c313f] space-y-1.5">
                  <div className="text-[10px] uppercase font-mono text-[#8e95a5]">Target Decibels</div>
                  <div className="text-base font-semibold text-[#dfe3eb]">45 – 55 dBA</div>
                  <p className="text-[11px] text-[#7d8595]">
                    Keep sound pressure below 60 dBA. 45–55 dBA effectively masks ambient noises while remaining safe for all-night inner ear health.
                  </p>
                </div>

                <div className="bg-[#1a1c23] p-3.5 rounded-xl border border-[#2c313f] space-y-1.5">
                  <div className="text-[10px] uppercase font-mono text-[#8e95a5]">Speaker Distance</div>
                  <div className="text-base font-semibold text-[#dfe3eb]">3 to 6 Feet Away</div>
                  <p className="text-[11px] text-[#7d8595]">
                    Avoid placing speakers or phones directly touching your pillow. Room diffusion creates a more natural spatial field.
                  </p>
                </div>

                <div className="bg-[#1a1c23] p-3.5 rounded-xl border border-[#2c313f] space-y-1.5">
                  <div className="text-[10px] uppercase font-mono text-[#8e95a5]">Screen Luminance</div>
                  <div className="text-base font-semibold text-[#dfe3eb]">Dim-Grey / Amber</div>
                  <p className="text-[11px] text-[#7d8595]">
                    Our bedside mode uses low-lux monochrome display to protect nocturnal melatonin synthesis from photoreceptor disruption.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with One-Click Optimal Preset Trigger */}
        <div className="p-4 bg-[#191b21] border-t border-[#2d323f] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#8a91a1] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Optimal profile: Pink Downpour + Soft Thunder + 45m Fade Timer</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onApplyPreset && (
              <button
                type="button"
                onClick={handleApplyOptimal}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                style={{
                  backgroundColor: theme.colorHex,
                  color: '#16181d',
                }}
              >
                {appliedNotification ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Applied to Soundscape!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Apply Optimal Mix</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#242730] hover:bg-[#2b303c] border border-[#343946] text-xs font-medium text-[#c9ced8] hover:text-white transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
