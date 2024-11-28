export const creativeTemplate = `
<div class="max-w-4xl mx-auto p-8 bg-white">
  <header class="mb-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg">
    <h1 class="text-4xl font-bold mb-2">[Full Name]</h1>
    <h2 class="text-xl opacity-90">[Professional Title]</h2>
    <div class="mt-4 flex flex-wrap gap-4 text-sm">
      <span class="flex items-center">📧 [Email]</span>
      <span class="flex items-center">📱 [Phone]</span>
      <span class="flex items-center">📍 [Location]</span>
    </div>
  </header>

  <div class="grid grid-cols-3 gap-8">
    <div class="col-span-2">
      <section class="mb-8">
        <h2 class="text-2xl font-bold text-purple-600 mb-4">About Me</h2>
        <p class="text-gray-700 leading-relaxed">
          Creative and innovative [Professional] with a passion for [Industry].
          Bringing [X] years of experience in [Specialization].
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-bold text-purple-600 mb-4">Experience</h2>
        <div class="space-y-6">
          <div class="relative pl-8 border-l-2 border-purple-200">
            <div class="absolute w-4 h-4 bg-purple-500 rounded-full -left-[9px] top-0"></div>
            <h3 class="text-xl font-semibold text-gray-900">[Job Title]</h3>
            <div class="text-purple-600 mb-2">[Company Name] • [Date Range]</div>
            <ul class="list-disc list-inside text-gray-700 space-y-2">
              <li>Spearheaded [Project] resulting in [Outcome]</li>
              <li>Designed and implemented [Initiative]</li>
              <li>Collaborated with [Team/Client] to deliver [Result]</li>
            </ul>
          </div>
        </div>
      </section>
    </div>

    <div class="col-span-1">
      <section class="mb-8 bg-purple-50 p-6 rounded-lg">
        <h2 class="text-2xl font-bold text-purple-600 mb-4">Skills</h2>
        <div class="space-y-2">
          <div class="relative pt-1">
            <div class="text-gray-700">[Skill 1]</div>
            <div class="flex h-2 mb-4 overflow-hidden bg-purple-200 rounded">
              <div class="w-[85%] bg-purple-500"></div>
            </div>
          </div>
          <div class="relative pt-1">
            <div class="text-gray-700">[Skill 2]</div>
            <div class="flex h-2 mb-4 overflow-hidden bg-purple-200 rounded">
              <div class="w-[75%] bg-purple-500"></div>
            </div>
          </div>
        </div>
      </section>

      <section class="mb-8 bg-purple-50 p-6 rounded-lg">
        <h2 class="text-2xl font-bold text-purple-600 mb-4">Education</h2>
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-gray-900">[Degree]</h3>
          <div class="text-purple-600">[University]</div>
          <div class="text-gray-600">[Graduation Year]</div>
        </div>
      </section>
    </div>
  </div>
</div>`;