import { useState, useEffect, useRef } from 'react';
import styles from './InfoBanner.module.css';

export default function InfoBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'candidate' | 'whykoinx'>('candidate');
  const [showConfetti, setShowConfetti] = useState(false);
  const [hireStatus, setHireStatus] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!showConfetti || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 400;
    canvas.height = canvas.parentElement?.clientHeight || 600;

    const colors = ['#2563eb', '#10b981', '#f43f5e', '#fbbf24', '#a855f7'];
    const particles = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 5 + 3,
      d: Math.random() * canvas.height,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0,
    }));

    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const timeout = setTimeout(() => {
      cancelAnimationFrame(animationId);
      setShowConfetti(false);
    }, 4500);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(timeout);
    };
  }, [showConfetti]);

  const handleHireClick = () => {
    setShowConfetti(true);
    setHireStatus('celebrate');
  };

  return (
    <>
      <div className={styles.banner}>
        <div className={styles.iconContainer}>
          <span className={styles.icon}>💡</span>
        </div>
        <div className={styles.content}>
          <h4 className={styles.bannerTitle}>What is Tax Loss Harvesting?</h4>
          <p className={styles.bannerDescription}>
            Tax loss harvesting allows you to offset your capital gains by selling underperforming assets at a loss. 
            By doing this, you reduce your net taxable income and lower your overall tax liability. Select assets 
            from the table below to simulate and optimize your tax savings in real-time.
          </p>
        </div>
      </div>

      <button 
        className={styles.floatingTrigger} 
        onClick={() => setIsOpen(true)}
        aria-label="Open Candidate Evaluation Drawer"
      >
        <span className={styles.pulseDot}></span>
        <span className={styles.triggerText}>Candidate Eval Panel</span>
      </button>

      {isOpen && (
        <div className={styles.drawerOverlay} onClick={() => setIsOpen(false)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            {showConfetti && <canvas ref={canvasRef} className={styles.drawerConfetti} />}
            
            <div className={styles.drawerHeader}>
              <div>
                <span className={styles.drawerBadge}>Hiring Spotlight</span>
                <h3 className={styles.drawerTitle}>Candidate Console</h3>
              </div>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)} aria-label="Close drawer">
                ✕
              </button>
            </div>

            <div className={styles.drawerBody}>
              <div className={styles.drawerTabs}>
                <button
                  className={`${styles.drawerTabBtn} ${activeTab === 'candidate' ? styles.activeDrawerTab : ''}`}
                  onClick={() => setActiveTab('candidate')}
                >
                  🎓 Applicant Profile
                </button>
                <button
                  className={`${styles.drawerTabBtn} ${activeTab === 'whykoinx' ? styles.activeDrawerTab : ''}`}
                  onClick={() => setActiveTab('whykoinx')}
                >
                  🚀 Why KoinX?
                </button>
              </div>

              <div className={styles.drawerTabContent}>
                {activeTab === 'candidate' && (
                  <div className={styles.animateFade}>
                    <h4 className={styles.sectionTitle}>Frontend Intern Candidate</h4>
                    <ul className={styles.candidateList}>
                      <li><strong>Graduation Target:</strong> 2027 and beyond (Compliant with KoinX eligibility)</li>
                      <li><strong>Core Skills:</strong> React 18, TypeScript, Clean Context State architecture, Responsive CSS Modules</li>
                      <li><strong>Availability:</strong> Remote ready (20-25 hrs/week commitment)</li>
                    </ul>
                  </div>
                )}

                {activeTab === 'whykoinx' && (
                  <div className={styles.animateFade}>
                    <h4 className={styles.sectionTitle}>Passion for Fintech & UX</h4>
                    <p className={styles.drawerText}>
                      Building at KoinX is an incredible opportunity to shape modern financial user experiences. 
                      I am passionate about creating high-fidelity, high-performance dashboards that simplify crypto tax tracking 
                      for global users.
                    </p>
                  </div>
                )}
              </div>

              <div className={styles.evaluationCard}>
                <h4 className={styles.evalCardTitle}>Hiring Evaluator Sandbox</h4>
                <p className={styles.evalCardDesc}>
                  Validate responsive metrics or complete this evaluation directly:
                </p>

                <div className={styles.evalActions}>
                  <button
                    className={styles.evalActionBtn}
                    onClick={() => {
                      setIsOpen(false);
                      setTimeout(() => alert('💡 Evaluator Tip: Try selecting EASYFI (EZ) or GONE in the table below to trigger the Tax Savings Badge animation!'), 400);
                    }}
                  >
                    🔍 Offset Tax Guide
                  </button>
                  <button
                    className={styles.evalActionBtn}
                    onClick={() => alert('📱 Mobile Check: Resize your browser viewport to test the mobile-friendly layout and table compression!')}
                  >
                    📱 View Mobile Guide
                  </button>
                </div>

                <div className={styles.hireActionWrapper}>
                  {hireStatus === 'celebrate' ? (
                    <div className={styles.successHireAlert}>
                      🎉 <strong>Awesome choice!</strong> Looking forward to building outstanding products together at KoinX! 🚀
                    </div>
                  ) : (
                    <button className={styles.confirmHireBtn} onClick={handleHireClick}>
                      🤝 Secure Hire
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
