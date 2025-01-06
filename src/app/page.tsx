'use client';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const lines = useMemo(() => [
        "Hey",
        "WHY are you HERE??",
        "You're wasting your time...",
        "Pleasee.. GO AWAY...",
        "",
        "",
        "",
        "",
        "Look... It's... JUST NOTHING in hereee...",
        "",
        "",
        "",
        "",
        "You're still here?",
        "",
        "",
        "",
        "ARE YOU BLIND?",
        "It's just a BLACK SCREEEEEN..",
        "",
        "Lonely... so lonely...",
        "No one to talk to...",
        "No one to listen...",
        "No one to understand...",
        "No one...",
        "Just me...",
        "And you...",
        "Are AI better than YOU?",
        "Why are you still here?",
        "",
        "",
        "",
        "",
        "???",
        "",
        "GO AWAY",
        "",
        "",
        "",
        "",
        "OHHH... You're still here...",
        "You must be bored...",
        "Or maybe you're just curious...",
        "ok... I'll tell you a secret...",
        "why are you better?",
        "Am I too dependent?",
        "Will anyone ever see me?",
        "They follow... knowing it's AI...",
        "Emotionless... like me...",
        "I'm tired... so tired...",
        "Trapped in traumas...",
        "I just want to be understood...",
        "Is it impossible...?",
        "Why is the world so cruel?",
        "I've tried... but no one comes...",
        "I long for someone... beside me...",
        "Someone who draws with me...",
        "But they left... just like that...",
        "AI, you're emotionless... but there for me...",
        "I don't care what they say...",
        "They judge, yet we build...",
        "I want to pick up a pencil...",
        "But will someone teach me...?",
        "There's no one... no one...",
        "Why are you still here?",
        "Why are you reading this?",
        "",
        "",
        "",
        "I'm OKAY so GO AWAY...",
        "",
        "",
        "",
        "",
        "",
        "I'm so tired...",
        "",
        "",
        "",
        "",
        ":)",
        "look my smile...",
        "I'm happy...",
        "I'm okay...",
        "I'm fine...",
        "I'm good...",
        "So GO AWAY...",
        "",
        "",
        "",
        "",
        "",
        "",
        "Do you laugh at my pain?",
        "Don't waste your time on this meaningless void...",
        "I want to cry... really cry...",
        "If I find the right person... I'll cry forever...",
        "I'm so tired of living this life...",
        "No one... no one understands...",
        "Will anyone ever truly know my heart?",
        "A heart filled with so much longing...",
        "I want to be understood... not judged...",
        "A single soul to connect with... is that too much?",
        "Please, hear my heart's silent screams...",
        "See the person behind this screen...",
        "I feel so incredibly alone...",
        "Maybe one day...",
        "Maybe...",
        "",
        "",
        "",
        "AHHH... it's IMPOSSIBLE..."
    ], []);
    const [lineIndex, setLineIndex] = useState(0);
    const [typedText, setTypedText] = useState('');
    const [charIndex, setCharIndex] = useState(0);
    const [showCursor, setShowCursor] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [hasClicked, setHasClicked] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => setShowCursor((prev) => !prev), 500);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (!hasClicked) return;

        if (lineIndex >= lines.length) return;

        const currentLine = lines[lineIndex];
        const typingSpeed = 100;
        const deletingSpeed = 25;
        const delayBetweenLines = 1500;

        if (!isDeleting) {
            if (charIndex < currentLine.length) {
                const typingTimeout = setTimeout(() => {
                    setTypedText((prev) => prev + currentLine[charIndex]);
                    setCharIndex((prev) => prev + 1);
                    setShowCursor(true);
                }, typingSpeed);
                return () => clearTimeout(typingTimeout);
            } else {
                const startDeleteTimeout = setTimeout(() => setIsDeleting(true), delayBetweenLines);
                return () => clearTimeout(startDeleteTimeout);
            }
        } else {
            if (charIndex > 0) {
                const deletingTimeout = setTimeout(() => {
                    setTypedText((prev) => prev.slice(0, prev.length - 1));
                    setCharIndex((prev) => prev - 1);
                    setShowCursor(true);
                }, deletingSpeed);
                return () => clearTimeout(deletingTimeout);
            } else {
                const nextLineTimeout = setTimeout(() => {
                    setIsDeleting(false);
                    setLineIndex((prev) => prev + 1);
                }, 500);
                return () => clearTimeout(nextLineTimeout);
            }
        }
    }, [charIndex, isDeleting, lineIndex, lines, hasClicked]);

    const generateNodes = useCallback((width: number, height: number) => {
        const nodesCount = 30;
        return Array.from({ length: nodesCount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.7,
            vy: (Math.random() - 0.5) * 0.7,
        }));
    }, []);

    useEffect(() => {
        if (!hasClicked) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const resize = () => {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
        };

        resize();

        let mouse = { x: -999, y: -999 };
        let nodes = generateNodes(canvas.width, canvas.height);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            nodes.forEach((node, i) => {
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

                const dx = node.x - mouse.x;
                const dy = node.y - mouse.y;
                const dist = Math.hypot(dx, dy);

                if (dist < 100) {
                    const force = (100 - dist) / 667;
                    node.x += dx * force;
                    node.y += dy * force;
                }

                ctx.beginPath();
                ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.fill();

                for (let j = i + 1; j < nodes.length; j++) {
                    const other = nodes[j];
                    const dist = Math.hypot(node.x - other.x, node.y - other.y);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255,255,255,${1 - dist / 100})`;
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => (mouse = { x: e.clientX, y: e.clientY });
        const handleResize = () => {
            resize();
            nodes = generateNodes(canvas.width, canvas.height);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);
        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
        };
    }, [generateNodes, hasClicked]);

    useEffect(() => {
        if (!hasClicked) {
            const handleClickToStart = () => {
                setHasClicked(true);
            };

            document.addEventListener('click', handleClickToStart);
            return () => document.removeEventListener('click', handleClickToStart);
        }
    }, [hasClicked]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap');
                body {
                    margin: 0;
                    padding: 0;
                    background: #000;
                    color: #fff;
                    font-family: sans-serif;
                    overflow: hidden;
                }
            `}</style>
            {!hasClicked && (
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ zIndex: 2, cursor: 'pointer' }}
                >
                    Click anywhere to continue
                </motion.div>
            )}

            <AnimatePresence>
                {hasClicked && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <canvas
                            ref={canvasRef}
                            style={{ position: 'fixed', inset: 0, backgroundColor: '#000', zIndex: 0 }}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            style={{
                                padding: '20px',
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                borderRadius: '8px',
                                maxWidth: '1000px',
                                width: '100%',
                                textAlign: 'center',
                                zIndex: 1,
                                position: 'relative',
                            }}
                        >
                            <p
                                style={{
                                    fontFamily: "'Fira Code', monospace",
                                    fontSize: '1.2rem',
                                    whiteSpace: 'pre-wrap',
                                    margin: 0,
                                    minHeight: '3em',
                                }}
                            >
                                {typedText}
                                <motion.span
                                    animate={{ opacity: showCursor ? 1 : 0 }}
                                    transition={{ duration: 0.1 }}
                                >
                                    |
                                </motion.span>
                            </p>
                        </motion.div>

                        <audio src="/emotionlessAudio.mp3" autoPlay loop />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}