export const modernTemplate = `
<div class="max-w-[850px] mx-auto p-8 bg-white">
  <!-- Header -->
  <header class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">[Full Name]</h1>
    <div class="text-gray-600 space-x-4">
      <span>[Email]</span>
      <span>[Phone]</span>
      <span>[Location]</span>
    </div>
  </header>

  <!-- Professional Experience -->
  <section class="mb-8">
    <h2 class="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Professional Experience</h2>
    <div class="space-y-6">
      <div class="mb-6">
        <div class="flex justify-between items-baseline mb-1">
          <h3 class="text-lg font-semibold text-gray-900">[Job Title]</h3>
          <span class="text-gray-600">[Start Date] - [End Date]</span>
        </div>
        <div class="text-gray-700 mb-2">[Company Name]</div>
        <ul class="list-disc pl-5 space-y-1 text-gray-700">
          <li>[Achievement 1]</li>
          <li>[Achievement 2]</li>
          <li>[Achievement 3]</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- Education -->
  <section class="mb-8">
    <h2 class="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Education</h2>
    <div class="mb-4">
      <div class="flex justify-between items-baseline">
        <h3 class="text-lg font-semibold text-gray-900">[Degree]</h3>
        <span class="text-gray-600">[Graduation Date]</span>
      </div>
      <div class="text-gray-700">[University]</div>
      <div class="text-gray-600">[Additional Details]</div>
    </div>
  </section>

  <!-- Skills -->
  <section class="mb-8">
    <h2 class="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Skills</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h3 class="font-semibold text-gray-900 mb-2">Technical Skills</h3>
        <ul class="list-disc pl-5 text-gray-700">
          <li>[Technical Skill 1]</li>
          <li>[Technical Skill 2]</li>
          <li>[Technical Skill 3]</li>
        </ul>
      </div>
      <div>
        <h3 class="font-semibold text-gray-900 mb-2">Additional Skills</h3>
        <ul class="list-disc pl-5 text-gray-700">
          <li>[Additional Skill 1]</li>
          <li>[Additional Skill 2]</li>
          <li>[Additional Skill 3]</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- Additional Information -->
  <section>
    <h2 class="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Additional Information</h2>
    <ul class="list-disc pl-5 text-gray-700">
      <li>[Certification/Award]</li>
      <li>[Volunteer Experience]</li>
      <li>[Other Relevant Information]</li>
    </ul>
  </section>
</div>`;