import React, { useState, useRef, useEffect } from 'react';
import { FaTerminal } from 'react-icons/fa';
import { defaultProfile, defaultSkills, defaultProjects } from '../data/defaultData';
import { useTheme } from '../context/ThemeContext';
import './DeveloperTerminal.css';

function DeveloperTerminal({ isOpen: initialOpen = true }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    {
      type: 'system',
      text: "Welcome to Diro's Interactive Developer Terminal v2.5.0\nType 'help' to view available commands, or explore using the quick shortcuts below.",
    },
  ]);
  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);
  const { toggleTheme } = useTheme();

  useEffect(() => {
    if (isOpen && !isMinimized && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isOpen, isMinimized]);

  const executeCommand = (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const newHistory = [...history, { type: 'input', text: trimmed }];
    const lower = trimmed.toLowerCase();

    switch (lower) {
      case 'help':
        newHistory.push({
          type: 'output',
          text: `AVAILABLE COMMANDS:
  • about       - Overview of who Diro Uchure is
  • skills      - Core tech stack & technical proficiencies
  • projects    - Featured web applications & live links
  • experience  - Career journey & software engineering roles
  • contact     - Direct email, phone, and social handles
  • theme       - Toggle between Light and Dark mode
  • clear       - Clean terminal screen
  • hire        - Fast-track inquiry & consultation request`,
        });
        break;

      case 'about':
      case 'whoami':
        newHistory.push({
          type: 'output',
          text: `NAME: ${defaultProfile.full_name}
ROLE: ${defaultProfile.title}
LOCATION: ${defaultProfile.location}
STATUS: Available for remote & on-site software engineering opportunities.
BIO: ${defaultProfile.bio}`,
        });
        break;

      case 'skills':
        const skillsList = defaultSkills
          .map((s) => `  [${s.category}] ${s.skill_name} (${s.proficiency}%)`)
          .join('\n');
        newHistory.push({
          type: 'output',
          text: `TECHNICAL ARSENAL:\n${skillsList}`,
        });
        break;

      case 'projects':
        const projList = defaultProjects
          .map((p, idx) => `  ${idx + 1}. ${p.title} (${p.category})\n     Stack: ${p.technologies}\n     Code: ${p.github_url}`)
          .join('\n\n');
        newHistory.push({
          type: 'output',
          text: `FEATURED PROJECTS:\n${projList}`,
        });
        break;

      case 'experience':
        newHistory.push({
          type: 'output',
          text: `EXPERIENCE SUMMARY:
  • Full Stack Web Developer (Freelance & Independent Projects) | 2023 - Present
    - Architecting end-to-end applications, secure JWT backends, and responsive React UIs.
  • Frontend Developer (Digital Solutions Lab) | 2022 - 2022
    - Built responsive user interfaces and optimized Core Web Vitals.`,
        });
        break;

      case 'contact':
        newHistory.push({
          type: 'output',
          text: `GET IN TOUCH:
  • Email:    ${defaultProfile.email}
  • Phone:    ${defaultProfile.phone}
  • GitHub:   ${defaultProfile.github_url}
  • LinkedIn: ${defaultProfile.linkedin_url}`,
        });
        break;

      case 'hire':
        newHistory.push({
          type: 'output',
          text: `Looking to hire Diro or start a collaboration?
Send an email to ${defaultProfile.email} or visit the /contact page to submit your project requirements!`,
        });
        break;

      case 'theme':
        toggleTheme();
        newHistory.push({
          type: 'output',
          text: `System theme toggled successfully!`,
        });
        break;

      case 'sudo':
        newHistory.push({
          type: 'output',
          text: `Permission denied: Guest user already has root exploration privileges!`,
        });
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        newHistory.push({
          type: 'error',
          text: `Command not recognized: '${trimmed}'. Type 'help' to see valid commands.`,
        });
        break;
    }

    setHistory(newHistory);
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    }
  };

  const runQuick = (cmd) => {
    executeCommand(cmd);
    if (inputRef.current) inputRef.current.focus();
  };

  if (!isOpen) {
    return (
      <button 
        className="terminal-launcher"
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        title="Open Developer Terminal"
      >
        <FaTerminal />
        <span>Dev Console</span>
      </button>
    );
  }

  return (
    <div className={`dev-terminal-wrapper ${isMinimized ? 'minimized' : ''}`}>
      <div className="terminal-header">
        <div className="terminal-controls">
          <span 
            className="control-dot close" 
            onClick={() => setIsOpen(false)}
            title="Close"
          />
          <span 
            className="control-dot minimize" 
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? "Restore" : "Minimize"}
          />
          <span 
            className="control-dot maximize" 
            onClick={() => setIsMinimized(false)}
            title="Expand"
          />
        </div>
        <div className="terminal-title">
          <FaTerminal className="term-icon" /> diro@developer-portfolio:~ (zsh)
        </div>
        <div className="terminal-actions">
          <button 
            type="button" 
            className="term-hdr-btn" 
            onClick={() => setHistory([])}
            title="Clear output"
          >
            Clear
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="terminal-body" onClick={() => inputRef.current?.focus()}>
            {history.map((item, index) => (
              <div key={index} className={`terminal-line ${item.type}`}>
                {item.type === 'input' && (
                  <span className="prompt-prefix">diro@web:~$ </span>
                )}
                <pre>{item.text}</pre>
              </div>
            ))}
            <div className="terminal-input-row">
              <span className="prompt-prefix">diro@web:~$ </span>
              <input
                ref={inputRef}
                type="text"
                className="terminal-input"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="type a command... (e.g. skills, projects, contact)"
                autoFocus
              />
            </div>
            <div ref={terminalEndRef} />
          </div>

          <div className="terminal-quick-bar">
            <span className="quick-label">Quick Commands:</span>
            {['help', 'about', 'skills', 'projects', 'contact', 'hire', 'theme', 'clear'].map((cmd) => (
              <button
                key={cmd}
                type="button"
                className="quick-cmd-btn"
                onClick={() => runQuick(cmd)}
              >
                {cmd}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default DeveloperTerminal;
