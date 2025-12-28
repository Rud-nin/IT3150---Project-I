import { useRef, useState } from "react";
import styles from "./Draggable.module.css";

const DRAG_THRESHOLD = 5;

function Draggable({ children, onClick, onRelease }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    
    const lastMousePos = useRef({ x: 0, y: 0 });
    const startMousePos = useRef({ x: 0, y: 0 });
    const wasDragged = useRef(false);

    const onPointerDown = (e) => {
        const coords = { x: e.clientX, y: e.clientY };
        startMousePos.current = coords;
        lastMousePos.current = coords;
        
        wasDragged.current = false; 
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
        if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;

        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;

        const totalDist = Math.hypot(
            e.clientX - startMousePos.current.x,
            e.clientY - startMousePos.current.y
        );

        if (!wasDragged.current && totalDist > DRAG_THRESHOLD) {
            wasDragged.current = true;
            setIsDragging(true);
        }

        if (wasDragged.current) {
            setPosition((prev) => ({
                x: prev.x + dx,
                y: prev.y + dy,
            }));
            lastMousePos.current = { x: e.clientX, y: e.clientY };
        }
    };

    const onPointerUp = (e) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        setIsDragging(false);

        if (!wasDragged.current) {
            if (onClick) onClick(e);
        } else {
            if (onRelease) onRelease(e).then(() => setPosition({ x: 0, y: 0 }));
        }
        
        wasDragged.current = false;
    };

    return (
        <div
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                cursor: isDragging ? "grabbing" : "grab",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
        >
            {children}
        </div>
    );
}

export default Draggable;