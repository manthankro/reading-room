import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { submitWriterApplication } from "@/lib/writer-applications";

type FormState = "ready" | "sending" | "received" | "error";

const fieldClass =
  "mt-2 w-full rounded-xl border border-[var(--page-line)] bg-white/70 px-4 py-3 text-base text-[var(--page-fg)] placeholder:text-[var(--page-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]";

export function WriterApplicationScreen() {
  const [state, setState] = useState<FormState>("ready");
  const [error, setError] = useState("");
  const [notificationStatus, setNotificationStatus] = useState("");
  const [applicationId, setApplicationId] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setError("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const splitList = (value: FormDataEntryValue | null) =>
      String(value ?? "")
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);
    try {
      const result = await submitWriterApplication({
        data: {
          fullName: String(form.get("fullName") ?? ""),
          email: String(form.get("email") ?? ""),
          languages: splitList(form.get("languages")),
          genres: splitList(form.get("genres")),
          introduction: String(form.get("introduction") ?? ""),
          experience: String(form.get("experience") ?? ""),
          motivation: String(form.get("motivation") ?? ""),
          portfolioUrl: String(form.get("portfolioUrl") ?? ""),
          message: String(form.get("message") ?? ""),
          consent: form.get("consent") === "on",
          website: String(form.get("website") ?? ""),
        },
      });
      setApplicationId(result.id);
      setNotificationStatus(result.notificationStatus);
      setState("received");
      formElement.reset();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not save your application. Please try again.",
      );
      setState("error");
    }
  }

  return (
    <div className="shell" data-light="lamp">
      <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        <Link to="/" className="btn btn-ghost">
          <ArrowLeft className="size-4" aria-hidden /> Reading Room
        </Link>

        {state === "received" ? (
          <section className="paper mt-8 rounded-2xl px-6 py-10 sm:px-10" role="status">
            <div className="grid size-12 place-items-center rounded-full bg-[var(--color-accent)] text-white">
              <Check className="size-6" aria-hidden />
            </div>
            <p className="kicker sub mt-6">Application received</p>
            <h1 className="mt-2 font-reading text-4xl">Thank you for your interest.</h1>
            <p className="sub mt-4 max-w-xl text-lg leading-relaxed">
              Your application has been saved for the Reading Room team to review. We’ll contact
              you if there is a suitable opportunity.
            </p>
            {notificationStatus === "not_configured" ? (
              <p className="sub mt-4 text-sm">
                Your application is safely stored. The owner’s email notification still needs to
                be configured.
              </p>
            ) : notificationStatus === "failed" ? (
              <p className="sub mt-4 text-sm">
                Your application is safely stored. Its email notification is pending a secure retry.
              </p>
            ) : null}
            <p className="sub mt-5 text-xs">Reference: {applicationId}</p>
            <Link to="/" className="btn btn-solid mt-8">
              Return to the shelf
            </Link>
          </section>
        ) : (
          <>
            <header className="mt-9">
              <p className="kicker">For writers and storytellers</p>
              <h1 className="mt-3 max-w-2xl font-reading text-4xl leading-tight sm:text-5xl">
                Every story deserves a place.
              </h1>
              <p className="muted mt-5 max-w-2xl font-reading text-xl leading-relaxed">
                Do you write fiction, poetry, folklore, or stories in your own language? Tell us a
                little about your work and why you’d like to contribute.
              </p>
              <p className="muted mt-3 max-w-2xl text-sm leading-relaxed">
                Writers of every experience level are welcome. We are building original reading in
                English, Hindi, Marathi, Gujarati, Bengali, Tamil, Telugu, Kannada, Malayalam, and
                more. Questions? <a className="underline underline-offset-4" href="mailto:pramanixlabs@gmail.com">Contact PramanixLabs</a>.
              </p>
            </header>

            <form className="paper mt-8 rounded-2xl p-5 sm:p-9" onSubmit={submit}>
              <div className="grid gap-6">
                <label className="block">
                  <span className="kicker sub">Full name</span>
                  <input className={fieldClass} name="fullName" autoComplete="name" minLength={2} maxLength={120} required />
                </label>
                <label className="block">
                  <span className="kicker sub">Contact email</span>
                  <input className={fieldClass} name="email" type="email" autoComplete="email" maxLength={254} required />
                </label>
                <label className="block">
                  <span className="kicker sub">Writing languages</span>
                  <input className={fieldClass} name="languages" placeholder="Marathi, Hindi, English" maxLength={300} required />
                  <span className="sub mt-2 block text-sm">Separate languages with commas. Add any language you write in.</span>
                </label>
                <label className="block">
                  <span className="kicker sub">Genres or content types</span>
                  <input className={fieldClass} name="genres" placeholder="Fiction, poetry, folklore" maxLength={500} required />
                </label>
                <label className="block">
                  <span className="kicker sub">A short introduction</span>
                  <textarea className="writer-textarea" name="introduction" minLength={20} maxLength={1200} required />
                </label>
                <label className="block">
                  <span className="kicker sub">Writing experience</span>
                  <textarea className="writer-textarea" name="experience" maxLength={1200} placeholder="Professional experience is not required." />
                </label>
                <label className="block">
                  <span className="kicker sub">Why would you like to join Reading Room?</span>
                  <textarea className="writer-textarea" name="motivation" minLength={20} maxLength={1600} required />
                </label>
                <label className="block">
                  <span className="kicker sub">Writing sample or portfolio URL (optional)</span>
                  <input className={fieldClass} name="portfolioUrl" type="url" maxLength={2048} placeholder="https://" />
                </label>
                <label className="block">
                  <span className="kicker sub">Message to the team (optional)</span>
                  <textarea className="writer-textarea" name="message" maxLength={1600} />
                </label>

                <label className="sr-only" aria-hidden="true">
                  Leave this field empty
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
                <label className="flex items-start gap-3 text-sm leading-relaxed">
                  <input className="mt-1 size-4 accent-[var(--color-accent)]" type="checkbox" name="consent" required />
                  <span>I agree that Reading Room may contact me about this application.</span>
                </label>

                {state === "error" ? (
                  <p className="rounded-lg border border-red-900/20 bg-red-100/60 px-4 py-3 text-sm text-red-950" role="alert">
                    {error}
                  </p>
                ) : null}

                <button className="btn btn-solid w-fit" type="submit" disabled={state === "sending"}>
                  <Send className="size-4" aria-hidden />
                  {state === "sending" ? "Sending…" : "Send application"}
                </button>
                <p className="sub text-xs leading-relaxed">
                  Applications are private and reviewed by the Reading Room team. Sending an
                  application does not guarantee acceptance or publication.
                </p>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
