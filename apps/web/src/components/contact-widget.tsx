"use client";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight, Mail, MessageCircle, X, Hexagon } from "lucide-react";

export function ContactWidget() {
  const panel = useRef<HTMLDialogElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button
        ref={launcher}
        className="chat-launcher"
        type="button"
        aria-label="Open HashNomads chat"
        aria-haspopup="dialog"
        aria-controls="hashnomads-chat"
        onClick={() => panel.current?.showModal()}
      >
        <MessageCircle size={23} aria-hidden="true" />
        <span>Let’s talk</span>
      </button>
      <dialog
        ref={panel}
        id="hashnomads-chat"
        className="chat-panel"
        aria-labelledby="chat-title"
        onClose={() => launcher.current?.focus()}
        onClick={(event) => {
          if (event.target === event.currentTarget) panel.current?.close();
        }}
      >
        <div className="chat-header">
          <span className="chat-mark">
            <Hexagon size={30} aria-hidden="true" />
          </span>
          <div>
            <strong>HashNomads</strong>
            <span>Your mining journey starts here.</span>
          </div>
          <button
            type="button"
            className="chat-close"
            aria-label="Close chat"
            autoFocus
            onClick={() => panel.current?.close()}
          >
            <X size={20} />
          </button>
        </div>
        <div className="chat-content">
          <span className="eyebrow">LET’S CONNECT</span>
          <h2 id="chat-title">How can we help?</h2>
          <p>Talk to us about mining hardware, hosting or your account.</p>
          <Link
            href="/contact"
            className="button primary"
            onClick={() => panel.current?.close()}
          >
            Send an enquiry <ArrowUpRight size={18} />
          </Link>
          <a className="chat-email" href="mailto:info@hashnomads.com">
            <Mail size={18} />
            info@hashnomads.com
          </a>
          <Link
            className="chat-faq"
            href="/faq"
            onClick={() => panel.current?.close()}
          >
            Explore frequently asked questions ↗
          </Link>
        </div>
      </dialog>
    </>
  );
}
