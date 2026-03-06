import React, { useState, useEffect, useRef } from 'react';

// ============================================
// SUBTLE GRID BACKGROUND
// ============================================
const SubtleGrid = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
      <div 
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.03] animate-drift-1"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.8) 0%, transparent 70%)',
          top: '10%',
          left: '20%',
        }}
      />
      <div 
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.02] animate-drift-2"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.6) 0%, transparent 70%)',
          bottom: '20%',
          right: '10%',
        }}
      />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent animate-scan" />
      </div>
    </div>
  );
};

// ============================================
// GLITCH TEXT EFFECT
// ============================================
const GlitchText = ({ children, className = '' }) => {
  const [glitch, setGlitch] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <span 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setGlitch(true)}
      onMouseLeave={() => setGlitch(false)}
    >
      <span className="relative z-10">{children}</span>
      {glitch && (
        <>
          <span className="absolute top-0 left-0 text-cyan-500 z-0 animate-pulse" style={{ clipPath: 'inset(0 0 50% 0)', transform: 'translateX(2px)' }}>{children}</span>
          <span className="absolute top-0 left-0 text-red-500 z-0" style={{ clipPath: 'inset(50% 0 0 0)', transform: 'translateX(-2px)' }}>{children}</span>
        </>
      )}
    </span>
  );
};

// ============================================
// TERMINAL WITH REAL COMMANDS
// ============================================
const Terminal = () => {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  
  const terminalLines = [
    { type: 'input', text: '$ nmap -sC -sV -oA scan target.com' },
    { type: 'output', text: 'Starting Nmap 7.94 ( https://nmap.org )' },
    { type: 'output', text: 'Nmap scan report for target.com (93.184.216.34)' },
    { type: 'success', text: 'PORT    STATE SERVICE  VERSION' },
    { type: 'success', text: '22/tcp  open  ssh      OpenSSH 8.9' },
    { type: 'success', text: '80/tcp  open  http     nginx 1.18.0' },
    { type: 'success', text: '443/tcp open  ssl/http nginx 1.18.0' },
    { type: 'input', text: '$ gobuster dir -u https://target.com -w /usr/share/wordlists/dirb/common.txt' },
    { type: 'output', text: 'Gobuster v3.6 - Directory/File Enumeration' },
    { type: 'success', text: '/admin         (Status: 301) [Size: 178]' },
    { type: 'success', text: '/api           (Status: 200) [Size: 2847]' },
    { type: 'warning', text: '/backup        (Status: 403) [Size: 548]' },
    { type: 'input', text: '$ sqlmap -u "https://target.com/api/users?id=1" --batch --dbs' },
    { type: 'output', text: '[*] testing connection to the target URL' },
    { type: 'output', text: '[*] testing for SQL injection on GET parameter "id"' },
    { type: 'danger', text: '[!] GET parameter "id" is vulnerable' },
    { type: 'danger', text: '[!] Type: boolean-based blind' },
    { type: 'success', text: '[+] available databases: information_schema, app_db' },
    { type: 'input', text: '$ _' },
  ];
  
  useEffect(() => {
    if (currentLine >= terminalLines.length) {
      const timeout = setTimeout(() => {
        setLines([]);
        setCurrentLine(0);
        setCurrentChar(0);
      }, 6000);
      return () => clearTimeout(timeout);
    }
    const line = terminalLines[currentLine];
    if (currentChar < line.text.length) {
      const timeout = setTimeout(() => setCurrentChar(c => c + 1), line.type === 'input' ? 50 : 15);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setLines(l => [...l, { ...line, text: line.text }]);
        setCurrentLine(c => c + 1);
        setCurrentChar(0);
      }, line.type === 'input' ? 800 : 150);
      return () => clearTimeout(timeout);
    }
  }, [currentLine, currentChar]);
  
  useEffect(() => {
    const interval = setInterval(() => setShowCursor(c => !c), 530);
    return () => clearInterval(interval);
  }, []);
  
  const getColor = (type) => {
    switch(type) {
      case 'input': return 'text-emerald-400';
      case 'success': return 'text-emerald-500';
      case 'warning': return 'text-yellow-500';
      case 'danger': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };
  
  const currentLineObj = terminalLines[currentLine];
  
  return (
    <div className="bg-black/90 border border-emerald-500/30 rounded-lg overflow-hidden shadow-2xl shadow-emerald-500/5">
      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border-b border-emerald-500/20">
        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        <span className="ml-2 font-mono text-xs text-gray-500">pentester@kali:~/engagements/target</span>
      </div>
      <div className="p-4 font-mono text-sm h-80 overflow-hidden">
        {lines.map((line, i) => (
          <div key={i} className={`${getColor(line.type)} ${line.type === 'danger' ? 'font-semibold' : ''}`}>{line.text}</div>
        ))}
        {currentLineObj && (
          <div className={getColor(currentLineObj.type)}>
            {currentLineObj.text.slice(0, currentChar)}
            {showCursor && <span className="bg-emerald-500 text-emerald-500">▊</span>}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// SCROLL REVEAL HOOK
// ============================================
const useScrollReveal = (threshold = 0.1) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  
  return [ref, isVisible];
};

// ============================================
// ICONS
// ============================================
const Icons = {
  Search: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Target: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth={2} />
      <circle cx="12" cy="12" r="6" strokeWidth={2} />
      <circle cx="12" cy="12" r="2" strokeWidth={2} />
    </svg>
  ),
  Code: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  Document: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Mail: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Location: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Terminal: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Arrow: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  Question: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

// ============================================
// NAVIGATION
// ============================================
const Nav = ({ activeSection, setActiveSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const sections = ['home', 'process', 'pricing', 'team', 'contact'];
  const labels = { home: 'Home', process: 'Our Process', pricing: 'Pricing', team: 'Team', contact: 'Contact' };
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md shadow-lg shadow-emerald-500/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => setActiveSection('home')} className="flex items-center gap-2 group">
          <div className="w-10 h-10 border-2 border-emerald-500 flex items-center justify-center font-mono text-emerald-500 font-bold group-hover:bg-emerald-500 group-hover:text-black transition-all duration-300 group-hover:shadow-lg group-hover:shadow-emerald-500/50">A</div>
          <span className="font-mono text-white font-bold tracking-wider"><GlitchText>ACKSEC</GlitchText></span>
        </button>
        
        <div className="hidden md:flex gap-8">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`font-mono text-sm tracking-wider transition-all duration-300 relative group ${activeSection === section ? 'text-emerald-400' : 'text-gray-500 hover:text-emerald-500'}`}
            >
              {labels[section]}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-emerald-500 transition-all duration-300 ${activeSection === section ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
          ))}
        </div>
        
        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          <span className={`w-6 h-0.5 bg-emerald-500 transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-emerald-500 transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-emerald-500 transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>
      
      <div className={`md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-emerald-500/20 transition-all duration-300 ${mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        {sections.map(section => (
          <button key={section} onClick={() => { setActiveSection(section); setMobileOpen(false); }} className="block w-full px-6 py-4 text-left font-mono text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/5 transition-all">
            {labels[section]}
          </button>
        ))}
      </div>
    </nav>
  );
};

// ============================================
// HERO SECTION
// ============================================
const Hero = ({ setActiveSection }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left - rect.width / 2) / 80,
      y: (e.clientY - rect.top - rect.height / 2) / 80,
    });
  };
  
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20" onMouseMove={handleMouseMove}>
      <div className="absolute w-[800px] h-[800px] rounded-full transition-all duration-500 opacity-[0.05]" style={{
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, transparent 60%)',
        left: '50%', top: '50%',
        transform: `translate(calc(-50% + ${mousePos.x * 3}px), calc(-50% + ${mousePos.y * 3}px))`,
      }}></div>
      
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tighter animate-fade-in-up">
          <GlitchText className="text-white">ACK</GlitchText>
          <span className="text-emerald-500">SEC</span>
        </h1>
        
        <div className="font-mono text-2xl md:text-3xl text-gray-300 mb-4 animate-fade-in-up animation-delay-200">Acknowledged Security</div>
        
        <p className="text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed text-lg animate-fade-in-up animation-delay-400">
          Professional penetration testing for modern web applications. We identify vulnerabilities before malicious actors do.
        </p>
        
        <div className="flex gap-4 justify-center flex-wrap animate-fade-in-up animation-delay-600">
          <button onClick={() => setActiveSection('contact')} className="group relative px-8 py-4 bg-emerald-500 text-black font-mono font-bold tracking-wider overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/50">
            <span className="relative z-10">GET STARTED</span>
            <div className="absolute inset-0 bg-emerald-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
          <button onClick={() => setActiveSection('process')} className="group px-8 py-4 border border-emerald-500/50 text-emerald-500 font-mono tracking-wider hover:bg-emerald-500/10 transition-all duration-300">
            <span className="relative z-10">OUR PROCESS</span>
          </button>
        </div>
        
        <div className="mt-16 max-w-2xl mx-auto animate-fade-in-up animation-delay-800">
          <Terminal />
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-emerald-500/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-emerald-500 rounded-full mt-2 animate-scroll"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// PROCESS SECTION
// ============================================
const Process = () => {
  const steps = [
    { number: '01', icon: <Icons.Search />, title: 'Reconnaissance', description: 'We gather information about your target systems, including subdomains, open ports, running services, and technology stack. This passive and active information gathering phase forms the foundation for the entire assessment.' },
    { number: '02', icon: <Icons.Target />, title: 'Vulnerability Analysis', description: 'Using the information gathered, we identify potential security weaknesses in your applications and infrastructure. This includes checking for known CVEs, misconfigurations, and common vulnerability patterns.' },
    { number: '03', icon: <Icons.Terminal />, title: 'Exploitation', description: 'We attempt to exploit identified vulnerabilities to demonstrate real-world impact. This proves whether theoretical vulnerabilities can actually be leveraged by attackers and shows the potential damage.' },
    { number: '04', icon: <Icons.Code />, title: 'Post-Exploitation', description: 'After gaining initial access, we explore what an attacker could achieve. This includes accessing sensitive data, pivoting to other systems, and understanding the full scope of a potential breach.' },
    { number: '05', icon: <Icons.Document />, title: 'Reporting', description: 'We compile our findings into a comprehensive report detailing all discovered vulnerabilities, their severity, proof-of-concept demonstrations, and actionable remediation recommendations.' },
  ];
  
  return (
    <section className="min-h-screen py-32 px-6 relative">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <div className="font-mono text-emerald-500 text-sm mb-4">// OUR METHODOLOGY</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Penetration Testing <span className="text-emerald-500">Process</span></h2>
          <p className="text-gray-500 max-w-2xl mx-auto">A systematic approach to identifying and demonstrating security vulnerabilities in your systems.</p>
        </div>
        
        <div className="space-y-8">
          {steps.map((step, i) => {
            const [ref, isVisible] = useScrollReveal(0.2);
            return (
              <div key={i} ref={ref} className={`group relative grid md:grid-cols-[100px_1fr] gap-6 p-8 border border-emerald-500/20 bg-black/50 backdrop-blur-sm hover:border-emerald-500/40 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="flex flex-col items-center">
                  <span className="font-mono text-4xl font-bold text-emerald-500/30 group-hover:text-emerald-500/50 transition-colors">{step.number}</span>
                  <div className="mt-4 w-12 h-12 border border-emerald-500/30 flex items-center justify-center text-emerald-500 group-hover:border-emerald-500 group-hover:bg-emerald-500/10 transition-all">{step.icon}</div>
                </div>
                <div>
                  <h3 className="font-mono text-xl text-white mb-3 group-hover:text-emerald-400 transition-colors">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{step.description}</p>
                </div>
                {i < steps.length - 1 && <div className="hidden md:block absolute left-[50px] top-full w-px h-8 bg-gradient-to-b from-emerald-500/30 to-transparent"></div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ============================================
// PRICING SECTION
// ============================================
const Pricing = ({ setActiveSection, setSelectedPlan }) => {
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setActiveSection('contact');
  };

  const plans = [
    {
      name: 'STARTER',
      price: '75',
      period: 'per engagement',
      recommended: 'Recommended for startups, small websites, and landing pages',
      features: [
        'Up to 2 hours of testing',
        'Core vulnerability assessment',
        'Standard and publicly known payloads only',
        'Exploitation testing without post-exploitation',
        'Basic report',
        'Email support'
      ],
    },
    {
      name: 'PROFESSIONAL',
      price: '150',
      period: 'per engagement',
      recommended: 'Recommended for growing businesses',
      features: [
        'Up to 4 hours of testing',
        'Thorough vulnerability assessment',
        'Standard custom payloads with your approval',
        'Post-exploitation available upon request',
        'Detailed report',
        'Email support'
      ],
    },
    {
      name: 'ENTERPRISE',
      price: '500',
      period: 'per engagement',
      recommended: 'Recommended for established businesses',
      features: [
        '10+ hours of testing',
        'In-depth vulnerability assessment',
        'Advanced custom payloads with your approval',
        'Post-exploitation available upon request',
        'Comprehensive report',
        'Email support'
      ],
    },
    {
      name: 'CUSTOM',
      price: 'Quote',
      period: 'tailored scope',
      recommended: 'Recommended for specific requirements',
      features: [
        'Flexible time allocation or hourly rate',
        'Scope tailored to your needs',
        'Choose assessment depth and focus areas',
        'Phishing tests and stealth exercises available',
        'Report format of your choice',
        'Email support'
      ],
    }
  ];
  
  return (
    <section className="min-h-screen py-32 px-6 bg-gradient-to-b from-black via-emerald-950/5 to-black relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="font-mono text-emerald-500 text-sm mb-4">// PRICING</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Transparent <span className="text-emerald-500">Pricing</span></h2>
          <p className="text-gray-500 max-w-xl mx-auto">Security testing accessible to businesses of all sizes. No hidden fees.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => {
            const [ref, isVisible] = useScrollReveal(0.2);
            return (
              <div 
                key={i}
                ref={ref}
                className={`relative p-6 border border-emerald-500/20 bg-black/50 hover:border-emerald-500/40 transition-all duration-500 flex flex-col ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="font-mono text-emerald-500 text-sm mb-2">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  {plan.price !== 'Quote' && <span className="text-gray-500 text-lg">CHF</span>}
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                </div>
                <div className="text-gray-600 text-xs mb-3 font-mono">{plan.period}</div>
                <p className="text-emerald-500/70 text-xs mb-4 italic">{plan.recommended}</p>
                
                <ul className="space-y-2 mb-6 flex-grow">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="text-emerald-500 mt-0.5 flex-shrink-0"><Icons.Check /></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => handleSelectPlan(plan.name.toLowerCase())}
                  className="w-full py-3 font-mono text-sm tracking-wider transition-all duration-300 border border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10 mt-auto"
                >
                  {plan.price === 'Quote' ? 'GET QUOTE' : 'SELECT'}
                </button>
              </div>
            );
          })}
        </div>
        
        {/* Customization Info Box */}
        <div className="mt-12 p-6 border border-emerald-500/20 bg-black/50 backdrop-blur-sm">
          <h3 className="font-mono text-lg text-white mb-4">Customization & How It Works</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            All plans from Starter to Enterprise are partially customizable. We're happy to adjust details within reason, but if your requirements deviate significantly from your chosen plan and align better with another, we'll recommend the more suitable option. For highly specific or unique requirements, the Custom plan offers maximum flexibility.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            There's no direct payment form on this site because every engagement is discussed with the client beforehand. This ensures you get exactly what you need. Simply use the contact form or email us directly, and we'll guide you through the process and help determine which plan best fits your requirements.
          </p>
          
          <button 
            onClick={() => handleSelectPlan('unsure')}
            className="inline-flex items-center gap-2 px-6 py-3 font-mono text-sm tracking-wider transition-all duration-300 border border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10"
          >
            <Icons.Question />
            NOT SURE? LET US HELP
          </button>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">All prices in CHF. Final scope confirmed before engagement begins.</p>
        </div>
      </div>
    </section>
  );
};

// ============================================
// TEAM SECTION
// ============================================
const Team = () => {
  const team = [
    { name: 'Noah', role: 'Co-Founder & Lead Pentester', bio: 'Specializes in penetration testing and red teaming. Focused on web application security and developing methodologies for efficient vulnerability discovery.', initial: 'N' },
    { name: 'Nico', role: 'Co-Founder & ML Engineer', bio: 'Machine learning specialist developing tools and ML-powered solutions for penetration testing. Building automation to enhance testing efficiency.', initial: 'N' }
  ];
  
  return (
    <section className="min-h-screen py-32 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="font-mono text-emerald-500 text-sm mb-4">// TEAM</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">The <span className="text-emerald-500">Team</span></h2>
          <p className="text-gray-500 max-w-xl mx-auto">Security professionals based in Switzerland.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {team.map((member, i) => {
            const [ref, isVisible] = useScrollReveal(0.2);
            const [isHovered, setIsHovered] = useState(false);
            
            return (
              <div 
                key={i}
                ref={ref}
                className={`group p-8 border border-emerald-500/20 bg-black/50 backdrop-blur-sm hover:border-emerald-500/40 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${i * 150}ms` }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="relative w-20 h-20 mb-6">
                  <div className={`absolute inset-0 bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center font-mono text-emerald-500 text-2xl font-bold transition-all duration-500 ${isHovered ? 'rotate-6 scale-105' : ''}`}>{member.initial}</div>
                  <div className={`absolute inset-0 border-2 border-emerald-500/30 transition-all duration-500 ${isHovered ? '-rotate-6 scale-105' : ''}`}></div>
                </div>
                <h3 className="font-mono text-2xl text-white mb-1 group-hover:text-emerald-400 transition-colors">{member.name}</h3>
                <div className="text-emerald-500 text-sm font-mono mb-4">{member.role}</div>
                <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
              </div>
            );
          })}
        </div>
        
        <div className="mt-16 p-8 border border-emerald-500/20 bg-black/50 backdrop-blur-sm">
          <h3 className="font-mono text-xl text-white mb-4 flex items-center gap-2">
            <span className="text-emerald-500">{'>'}</span> About AckSec
          </h3>
          <p className="text-gray-500 leading-relaxed mb-4">
            AckSec was founded by two students from Canton Zürich with a simple mission: make professional penetration testing accessible to small businesses and startups.
          </p>
          <div className="flex items-center gap-3 pt-4 border-t border-emerald-500/20">
            <span className="text-lg">CH</span>
            <span className="text-gray-400">Based in Switzerland.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// CONTACT SECTION
// ============================================
const Contact = ({ selectedPlan }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    plan: selectedPlan || '',
    message: ''
  });
  const [focused, setFocused] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Update plan when selectedPlan prop changes
  useEffect(() => {
    if (selectedPlan) {
      setFormData(prev => ({ ...prev, plan: selectedPlan }));
    }
  }, [selectedPlan]);

  const planOptions = [
    { value: '', label: 'Select an option *' },
    { value: 'unsure', label: "I'm not sure — help me decide" },
    { value: 'starter', label: 'Starter (CHF 75)' },
    { value: 'professional', label: 'Professional (CHF 150)' },
    { value: 'enterprise', label: 'Enterprise (CHF 500)' },
    { value: 'custom', label: 'Custom (Quote)' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message || !formData.plan) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields, including selecting a plan.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', website: '', plan: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage('Failed to send message. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  };
  
  return (
    <section className="min-h-screen py-32 px-6 bg-gradient-to-b from-black via-emerald-950/5 to-black relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="font-mono text-emerald-500 text-sm mb-4">// CONTACT</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Get In <span className="text-emerald-500">Touch</span></h2>
          <p className="text-gray-500 max-w-xl mx-auto">Ready to assess your security posture? Let's discuss your requirements.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className={`block font-mono text-sm mb-2 transition-colors duration-300 ${focused === 'name' ? 'text-emerald-400' : 'text-emerald-500/70'}`}>NAME *</label>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                className="w-full px-4 py-3 bg-black border border-emerald-500/30 text-white font-mono focus:border-emerald-500 focus:outline-none transition-all duration-300 focus:shadow-lg focus:shadow-emerald-500/10"
                placeholder="Your name"
                disabled={status === 'loading'}
              />
            </div>

            {/* Email Field */}
            <div>
              <label className={`block font-mono text-sm mb-2 transition-colors duration-300 ${focused === 'email' ? 'text-emerald-400' : 'text-emerald-500/70'}`}>EMAIL *</label>
              <input 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                className="w-full px-4 py-3 bg-black border border-emerald-500/30 text-white font-mono focus:border-emerald-500 focus:outline-none transition-all duration-300 focus:shadow-lg focus:shadow-emerald-500/10"
                placeholder="you@company.com"
                disabled={status === 'loading'}
              />
            </div>

            {/* Website Field */}
            <div>
              <label className={`block font-mono text-sm mb-2 transition-colors duration-300 ${focused === 'website' ? 'text-emerald-400' : 'text-emerald-500/70'}`}>WEBSITE</label>
              <input 
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                onFocus={() => setFocused('website')}
                onBlur={() => setFocused(null)}
                className="w-full px-4 py-3 bg-black border border-emerald-500/30 text-white font-mono focus:border-emerald-500 focus:outline-none transition-all duration-300 focus:shadow-lg focus:shadow-emerald-500/10"
                placeholder="https://yoursite.com"
                disabled={status === 'loading'}
              />
            </div>

            {/* Plan Dropdown */}
            <div>
              <label className={`block font-mono text-sm mb-2 transition-colors duration-300 ${focused === 'plan' ? 'text-emerald-400' : 'text-emerald-500/70'}`}>INTERESTED IN *</label>
              <div className="relative">
                <select
                  value={formData.plan}
                  onChange={(e) => setFormData({...formData, plan: e.target.value})}
                  onFocus={() => setFocused('plan')}
                  onBlur={() => setFocused(null)}
                  className="w-full px-4 py-3 bg-black border border-emerald-500/30 text-white font-mono focus:border-emerald-500 focus:outline-none transition-all duration-300 focus:shadow-lg focus:shadow-emerald-500/10 appearance-none cursor-pointer"
                  disabled={status === 'loading'}
                >
                  {planOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-black">{option.label}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500">
                  <Icons.ChevronDown />
                </div>
              </div>
            </div>

            {/* Message Field */}
            <div>
              <label className={`block font-mono text-sm mb-2 transition-colors duration-300 ${focused === 'message' ? 'text-emerald-400' : 'text-emerald-500/70'}`}>MESSAGE *</label>
              <textarea 
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                onFocus={() => setFocused('message')}
                onBlur={() => setFocused(null)}
                className="w-full px-4 py-3 bg-black border border-emerald-500/30 text-white font-mono focus:border-emerald-500 focus:outline-none transition-all duration-300 focus:shadow-lg focus:shadow-emerald-500/10 resize-none"
                placeholder="Tell us about your project and security requirements..."
                disabled={status === 'loading'}
              />
            </div>
            
            {status === 'error' && (
              <div className="p-4 border border-red-500/50 bg-red-500/10 text-red-400 font-mono text-sm">{errorMessage}</div>
            )}
            
            {status === 'success' && (
              <div className="p-4 border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-mono text-sm">Message sent successfully! We'll get back to you soon.</div>
            )}
            
            <button 
              type="submit"
              disabled={status === 'loading'}
              className={`group relative w-full py-4 font-mono font-bold tracking-wider overflow-hidden transition-all duration-300 ${status === 'loading' ? 'bg-emerald-500/50 text-black/50 cursor-not-allowed' : 'bg-emerald-500 text-black hover:shadow-lg hover:shadow-emerald-500/50'}`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {status === 'loading' ? 'SENDING...' : 'SEND MESSAGE'}
                {status !== 'loading' && <Icons.Arrow />}
              </span>
              {status !== 'loading' && <div className="absolute inset-0 bg-emerald-400 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>}
            </button>
          </form>
          
          <div className="space-y-6">
            {[
              { icon: <Icons.Mail />, label: 'EMAIL', value: 'info@acksec.org', href: 'mailto:info@acksec.org' },
              { icon: <Icons.Location />, label: 'LOCATION', value: 'Canton Zürich, Switzerland' },
              { icon: <Icons.Clock />, label: 'RESPONSE TIME', value: 'Usually within 24 hours' },
            ].map((item, i) => (
              <div key={i} className="p-6 border border-emerald-500/20 bg-black/50 backdrop-blur-sm hover:border-emerald-500/40 transition-all duration-500 group">
                <div className="flex items-start gap-4">
                  <span className="text-emerald-500 group-hover:scale-110 transition-transform">{item.icon}</span>
                  <div>
                    <div className="font-mono text-emerald-500 text-sm mb-1">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="text-white hover:text-emerald-400 transition-colors">{item.value}</a>
                    ) : (
                      <div className="text-white">{item.value}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// PRIVACY POLICY
// ============================================
const Privacy = ({ setActiveSection }) => {
  return (
    <section className="min-h-screen py-32 px-6 relative">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => setActiveSection('home')} className="font-mono text-emerald-500 text-sm mb-8 hover:text-emerald-400 transition-colors flex items-center gap-2">
          <span>←</span> Back to Home
        </button>
        
        <div className="font-mono text-emerald-500 text-sm mb-4">// LEGAL</div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Privacy <span className="text-emerald-500">Policy</span></h1>
        
        <div className="space-y-8 text-gray-400 leading-relaxed">
          <p className="text-gray-500">Last updated: March 2025</p>
          
          <div>
            <h2 className="text-xl text-white mb-4 font-mono">1. Introduction</h2>
            <p>AckSec is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.</p>
          </div>
          
          <div>
            <h2 className="text-xl text-white mb-4 font-mono">2. Information We Collect</h2>
            <p className="mb-4">We collect information you provide directly to us, including:</p>
            <p>Contact information such as your name, email address, and website URL when you use our contact form or engage our services. We also collect any additional information you choose to provide in your messages to us.</p>
          </div>
          
          <div>
            <h2 className="text-xl text-white mb-4 font-mono">3. How We Use Your Information</h2>
            <p>We use the information we collect to respond to your inquiries, provide our penetration testing services, communicate with you about our services, and improve our website and services. We do not sell, trade, or otherwise transfer your personal information to third parties.</p>
          </div>
          
          <div>
            <h2 className="text-xl text-white mb-4 font-mono">4. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All data transmitted through our contact form is encrypted.</p>
          </div>
          
          <div>
            <h2 className="text-xl text-white mb-4 font-mono">5. Data Retention</h2>
            <p>We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, including to satisfy any legal, accounting, or reporting requirements.</p>
          </div>
          
          <div>
            <h2 className="text-xl text-white mb-4 font-mono">6. Your Rights</h2>
            <p>Under Swiss data protection law, you have the right to access, correct, or delete your personal information. You may also object to or restrict certain processing of your data. To exercise these rights, please contact us at info@acksec.org.</p>
          </div>
          
          <div>
            <h2 className="text-xl text-white mb-4 font-mono">7. Cookies</h2>
            <p>Our website does not use tracking cookies or analytics services. We do not collect any data about your browsing behavior.</p>
          </div>
          
          <div>
            <h2 className="text-xl text-white mb-4 font-mono">8. Contact</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at info@acksec.org.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// TERMS OF SERVICE
// ============================================
const Terms = ({ setActiveSection }) => {
  return (
    <section className="min-h-screen py-32 px-6 relative">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => setActiveSection('home')} className="font-mono text-emerald-500 text-sm mb-8 hover:text-emerald-400 transition-colors flex items-center gap-2">
          <span>←</span> Back to Home
        </button>
        
        <div className="font-mono text-emerald-500 text-sm mb-4">// LEGAL</div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Terms of <span className="text-emerald-500">Service</span></h1>
        
        <div className="space-y-8 text-gray-400 leading-relaxed">
          <p className="text-gray-500">Last updated: March 2025</p>
          
          <div>
            <h2 className="text-xl text-white mb-4 font-mono">1. Services</h2>
            <p>AckSec provides penetration testing and security assessment services. Our services are designed to identify vulnerabilities in your systems and applications. All testing is performed only on systems you own or have explicit written authorization to test.</p>
          </div>
          
          <div>
            <h2 className="text-xl text-white mb-4 font-mono">2. Authorization</h2>
            <p>By engaging our services, you confirm that you have the legal authority to authorize security testing on the specified systems. You agree to provide written authorization before any testing begins. Testing without proper authorization is illegal and we will not perform such tests.</p>
          </div>
          
          <div>
            <h2 className="text-xl text-white mb-4 font-mono">3. Scope of Work</h2>
            <p>The scope of each engagement will be defined in a separate agreement before testing begins. This includes the systems to be tested, testing methodology, timeline, and deliverables. Any changes to the scope must be agreed upon in writing.</p>
          </div>
          
          <div>
            <h2 className="text-xl text-white mb-4 font-mono">4. Confidentiality</h2>
            <p>We treat all information obtained during our engagements as strictly confidential. We will not disclose any vulnerabilities, findings, or client information to third parties without your explicit written consent. All reports and findings are delivered securely and exclusively to you.</p>
          </div>
          
          <div>
            <h2 className="text-xl text-white mb-4 font-mono">5. Limitation of Liability</h2>
            <p>While we take every precaution to minimize risks, penetration testing by its nature involves some risk of system disruption. We are not liable for any indirect, incidental, or consequential damages arising from our services. Our total liability is limited to the fees paid for the specific engagement.</p>
          </div>
          
          <div>
            <h2 className="text-xl text-white mb-4 font-mono">6. Payment Terms</h2>
            <p>Payment terms will be specified in the engagement agreement. All prices are in Swiss Francs (CHF) unless otherwise stated. Payment is typically due upon completion of the engagement and delivery of the report.</p>
          </div>
          
          <div>
            <h2 className="text-xl text-white mb-4 font-mono">7. Intellectual Property</h2>
            <p>Upon full payment, you receive full rights to the deliverables and reports produced during the engagement. We retain the right to use general knowledge and techniques gained during engagements, but never specific findings or client data.</p>
          </div>
          
          <div>
            <h2 className="text-xl text-white mb-4 font-mono">8. Governing Law</h2>
            <p>These terms are governed by the laws of Switzerland. Any disputes will be subject to the exclusive jurisdiction of the courts of Canton Zürich, Switzerland.</p>
          </div>
          
          <div>
            <h2 className="text-xl text-white mb-4 font-mono">9. Contact</h2>
            <p>For questions about these Terms of Service, please contact us at info@acksec.org.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// FOOTER
// ============================================
const Footer = ({ setActiveSection }) => {
  return (
    <footer className="py-12 px-6 border-t border-emerald-500/20 relative">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border border-emerald-500 flex items-center justify-center font-mono text-emerald-500 text-xs font-bold">A</div>
          <span className="font-mono text-gray-500 text-sm">© 2025 AckSec — Acknowledged Security</span>
        </div>
        
        <div className="flex gap-6 font-mono text-sm">
          <button onClick={() => setActiveSection('privacy')} className="text-gray-600 hover:text-emerald-500 transition-colors">Privacy</button>
          <button onClick={() => setActiveSection('terms')} className="text-gray-600 hover:text-emerald-500 transition-colors">Terms</button>
        </div>
        
        <div className="font-mono text-xs text-gray-600">Based in Switzerland</div>
      </div>
    </footer>
  );
};

// ============================================
// MAIN APP
// ============================================
export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedPlan, setSelectedPlan] = useState('');
  
  // Reset selected plan when navigating away from contact
  useEffect(() => {
    if (activeSection !== 'contact') {
      // Keep the plan for when they come back
    }
  }, [activeSection]);
  
  const renderSection = () => {
    switch(activeSection) {
      case 'home': return <Hero setActiveSection={setActiveSection} />;
      case 'process': return <Process />;
      case 'pricing': return <Pricing setActiveSection={setActiveSection} setSelectedPlan={setSelectedPlan} />;
      case 'team': return <Team />;
      case 'contact': return <Contact selectedPlan={selectedPlan} />;
      case 'privacy': return <Privacy setActiveSection={setActiveSection} />;
      case 'terms': return <Terms setActiveSection={setActiveSection} />;
      default: return <Hero setActiveSection={setActiveSection} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <SubtleGrid />
      <div className="fixed inset-0 pointer-events-none z-40 opacity-50" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)' }}></div>
      <Nav activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="relative z-10">{renderSection()}</main>
      <Footer setActiveSection={setActiveSection} />
      
      <style>{`
        @keyframes drift-1 { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(50px, 30px); } 50% { transform: translate(-30px, 60px); } 75% { transform: translate(-60px, 20px); } }
        @keyframes drift-2 { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-40px, -30px); } 50% { transform: translate(30px, -50px); } 75% { transform: translate(50px, -20px); } }
        @keyframes scan { 0% { top: -10%; } 100% { top: 110%; } }
        @keyframes scroll { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(6px); opacity: 0; } }
        .animate-drift-1 { animation: drift-1 30s ease-in-out infinite; }
        .animate-drift-2 { animation: drift-2 25s ease-in-out infinite; }
        .animate-scan { animation: scan 8s linear infinite; }
        .animate-scroll { animation: scroll 1.5s ease-in-out infinite; }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-800 { animation-delay: 800ms; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
