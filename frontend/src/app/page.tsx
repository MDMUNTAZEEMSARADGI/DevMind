"use client";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-800 bg-gray-900 p-5">
          <h1 className="text-2xl font-bold">🧠 DevMind</h1>

          <nav className="mt-8 space-y-2">
            <button className="w-full rounded-lg bg-gray-800 px-4 py-3 text-left">
              💬 Chat
            </button>

            <button className="w-full rounded-lg px-4 py-3 text-left hover:bg-gray-800">
              📚 Documents
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <section className="flex flex-1 flex-col">

          {/* Header */}
          <header className="border-b border-gray-800 px-6 py-4">
            <h2 className="text-lg font-semibold">DevMind AI</h2>
            <p className="text-sm text-gray-400">
              Your personal knowledge assistant
            </p>
          </header>

          {/* Chat area */}
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="text-5xl">🧠</div>

              <h2 className="mt-4 text-3xl font-bold">
                Welcome to DevMind
              </h2>

              <p className="mt-2 text-gray-400">
                Ask questions about your knowledge base.
              </p>
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-gray-800 p-5">
            <div className="mx-auto flex max-w-3xl gap-3">
              <input
                type="text"
                placeholder="Ask DevMind..."
                className="flex-1 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 outline-none focus:border-gray-500"
              />

              <button className="rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200">
                Send
              </button>
            </div>
          </div>

        </section>
      </div>
    </main>
  );
}