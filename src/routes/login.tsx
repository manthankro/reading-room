import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="shell grid min-h-screen place-items-center px-5 py-12">
      <section className="elev w-full max-w-md rounded-2xl border hairline p-7 sm:p-9">
        <Link to="/" className="btn btn-ghost -ml-3">
          <ArrowLeft className="size-4" aria-hidden /> Back to the shelf
        </Link>
        <BookOpen className="mt-8 size-8" aria-hidden />
        <p className="kicker mt-5">Your reading travels with you</p>
        <h1 className="mt-2 font-reading text-3xl">Save your shelf</h1>
        <p className="mt-3 leading-relaxed muted">
          Sign in to sync your notes, bookmarks, reading goals, and progress across devices. You can
          keep reading without an account too.
        </p>
        <div className="mt-7 grid gap-3">
          {authEnabled ? (
            GROK_PROVIDERS.map((provider) => (
              <button
                key={provider.providerId}
                className="btn btn-solid w-full"
                type="button"
                onClick={() => signIn(provider.providerId, { callbackURL: "/" })}
              >
                Continue with {provider.label}
              </button>
            ))
          ) : (
            <p className="text-sm muted">Account sync is unavailable right now.</p>
          )}
        </div>
        <p className="mt-5 text-xs leading-relaxed faint">
          Your notes and reading history are private to your account. Signing in stores a synced
          copy so you can continue on another device.
        </p>
      </section>
    </main>
  );
}
