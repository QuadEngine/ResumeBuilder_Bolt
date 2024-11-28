import { ProfileData } from '../types/profile';

export async function generateResume(profileData: ProfileData, templateId: string, isRegeneration = false): Promise<string> {
  let content = `
<div class="max-w-[850px] mx-auto p-8 bg-white">
  <!-- Header -->
  <header class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">${profileData.name}</h1>
    <div class="text-gray-600 space-x-4">
      <span>${profileData.email}</span>
      <span>${profileData.phone}</span>
      ${profileData.linkedin ? `<span>${profileData.linkedin}</span>` : ''}
      ${profileData.portfolio ? `<span>${profileData.portfolio}</span>` : ''}
    </div>
  </header>

  <!-- About & Career Objective -->
  <section class="mb-8">
    ${profileData.about ? `
    <div class="mb-4">
      <h2 class="text-xl font-bold text-gray-900 mb-2">About</h2>
      <p class="text-gray-700">${profileData.about}</p>
    </div>
    ` : ''}
    ${profileData.careerObjective ? `
    <div>
      <h2 class="text-xl font-bold text-gray-900 mb-2">Career Objective</h2>
      <p class="text-gray-700">${profileData.careerObjective}</p>
    </div>
    ` : ''}
  </section>

  <!-- Professional Experience -->
  <section class="mb-8">
    <h2 class="text-xl font-bold text-gray-900 mb-4">Professional Experience</h2>
    ${profileData.relevant_roles?.map(role => `
      <div class="mb-6">
        <div class="flex justify-between items-baseline mb-1">
          <h3 class="text-lg font-semibold text-gray-900">${role.jobTitle}</h3>
          <span class="text-gray-600">${role.startDate} - ${role.endDate}</span>
        </div>
        <div class="text-gray-700 mb-2">${role.companyName}</div>
        <div class="text-gray-700 whitespace-pre-line">${role.description}</div>
      </div>
    `).join('') || ''}
  </section>

  <!-- Education -->
  <section class="mb-8">
    <h2 class="text-xl font-bold text-gray-900 mb-4">Education</h2>
    ${profileData.education?.map(edu => `
      <div class="mb-4">
        <div class="flex justify-between items-baseline">
          <h3 class="text-lg font-semibold text-gray-900">${edu.degree} in ${edu.field}</h3>
          <span class="text-gray-600">${edu.graduationYear}</span>
        </div>
        <div class="text-gray-700">${edu.institution}</div>
        ${edu.grade ? `<div class="text-gray-600">Grade: ${edu.grade}</div>` : ''}
      </div>
    `).join('') || ''}
  </section>

  <!-- Skills & Certifications -->
  <section class="mb-8">
    <h2 class="text-xl font-bold text-gray-900 mb-4">Skills & Qualifications</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Technical Skills -->
      ${profileData.top_skills?.length ? `
      <div>
        <h3 class="font-semibold text-gray-900 mb-2">Technical Skills</h3>
        <div class="text-gray-700">${profileData.top_skills.join(', ')}</div>
      </div>
      ` : ''}

      <!-- Certifications -->
      ${profileData.certifications?.length ? `
      <div>
        <h3 class="font-semibold text-gray-900 mb-2">Certifications</h3>
        <ul class="list-disc pl-5 text-gray-700">
          ${profileData.certifications.map(cert => `<li>${cert}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
    </div>
  </section>

  <!-- Achievements -->
  ${profileData.achievements?.length ? `
  <section class="mb-8">
    <h2 class="text-xl font-bold text-gray-900 mb-4">Key Achievements</h2>
    <ul class="list-disc pl-5 text-gray-700">
      ${profileData.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
    </ul>
  </section>
  ` : ''}

  <!-- Target Roles & Industries -->
  ${(profileData.target_roles?.length || profileData.industries?.length) ? `
  <section class="mb-8">
    <h2 class="text-xl font-bold text-gray-900 mb-4">Career Preferences</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      ${profileData.target_roles?.length ? `
      <div>
        <h3 class="font-semibold text-gray-900 mb-2">Target Roles</h3>
        <ul class="list-disc pl-5 text-gray-700">
          ${profileData.target_roles.map(role => `<li>${role}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
      ${profileData.industries?.length ? `
      <div>
        <h3 class="font-semibold text-gray-900 mb-2">Industries of Interest</h3>
        <ul class="list-disc pl-5 text-gray-700">
          ${profileData.industries.map(industry => `<li>${industry}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
    </div>
  </section>
  ` : ''}

  <!-- Additional Notes -->
  ${profileData.notes ? `
  <section>
    <h2 class="text-xl font-bold text-gray-900 mb-4">Additional Information</h2>
    <p class="text-gray-700 whitespace-pre-line">${profileData.notes}</p>
  </section>
  ` : ''}
</div>`;

  return content;
}