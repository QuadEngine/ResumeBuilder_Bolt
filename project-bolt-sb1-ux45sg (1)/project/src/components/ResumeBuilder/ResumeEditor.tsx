import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

interface ResumeEditorProps {
  content: string;
  onSave: (content: string) => void;
  onCancel: () => void;
}

interface Section {
  id: string;
  title: string;
  content: string[];
  type: 'text' | 'list' | 'experience' | 'education' | 'skills';
}

export default function ResumeEditor({ content, onSave, onCancel }: ResumeEditorProps) {
  const [sections, setSections] = useState<Section[]>(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const mainDiv = doc.querySelector('div[class*="max-w"]');
    
    if (!mainDiv) return [];

    return Array.from(mainDiv.children).map((element, index) => {
      const section: Section = {
        id: `section-${index}`,
        title: '',
        content: [],
        type: 'text'
      };

      if (element.tagName === 'HEADER') {
        section.title = 'Header';
        section.type = 'text';
        const h1 = element.querySelector('h1');
        const contactDiv = element.querySelector('div[class*="text-gray-600"]');
        
        if (h1) {
          section.content.push(h1.textContent || '');
        }
        
        if (contactDiv) {
          const contactInfo = Array.from(contactDiv.querySelectorAll('span'))
            .map(span => span.textContent)
            .filter(Boolean)
            .join(' | ');
          section.content.push(contactInfo);
        }
      } else if (element.tagName === 'SECTION') {
        const h2 = element.querySelector('h2');
        section.title = h2?.textContent || '';

        // Professional Experience Section
        if (section.title.includes('Professional Experience')) {
          section.type = 'experience';
          const experienceItems = element.querySelectorAll('div[class*="mb-6"]');
          experienceItems.forEach(item => {
            const title = item.querySelector('h3')?.textContent;
            const date = item.querySelector('div[class*="text-gray-600"]')?.textContent;
            const company = item.querySelector('div[class*="text-gray-700"]')?.textContent;
            const description = item.querySelector('div[class*="whitespace-pre-line"]')?.textContent;
            
            if (title && date && company && description) {
              section.content.push(`${title} | ${date}`);
              section.content.push(company);
              section.content.push(description);
            }
          });
        }
        // Education Section
        else if (section.title.includes('Education')) {
          section.type = 'education';
          const educationItems = element.querySelectorAll('div[class*="mb-4"]');
          educationItems.forEach(item => {
            const degree = item.querySelector('h3')?.textContent;
            const date = item.querySelector('span[class*="text-gray-600"]')?.textContent;
            const institution = item.querySelector('div[class*="text-gray-700"]')?.textContent;
            const grade = item.querySelector('div[class*="text-gray-600"]')?.textContent;
            
            if (degree && institution) {
              section.content.push(`${degree}${date ? ` | ${date}` : ''}`);
              section.content.push(institution);
              if (grade) section.content.push(grade);
            }
          });
        }
        // Skills & Qualifications Section
        else if (section.title.includes('Skills')) {
          section.type = 'skills';
          const skillsDiv = element.querySelector('div[class*="text-gray-700"]');
          const certsList = element.querySelector('ul');
          
          if (skillsDiv) {
            section.content.push(skillsDiv.textContent || '');
          }
          
          if (certsList) {
            const certs = Array.from(certsList.querySelectorAll('li'))
              .map(li => li.textContent || '')
              .filter(Boolean);
            section.content.push(...certs);
          }
        }
        // About & Career Objective
        else if (section.title.includes('About') || section.title.includes('Career')) {
          section.type = 'text';
          const paragraphs = element.querySelectorAll('p');
          section.content = Array.from(paragraphs)
            .map(p => p.textContent || '')
            .filter(Boolean);
        }
        // Lists (Achievements, Target Roles, Industries)
        else if (element.querySelector('ul')) {
          section.type = 'list';
          const items = element.querySelectorAll('li');
          section.content = Array.from(items)
            .map(item => item.textContent || '')
            .filter(Boolean);
        }
      }

      return section;
    }).filter(section => section.content.length > 0);
  });

  const handleContentChange = (sectionId: string, index: number, value: string) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        const newContent = [...section.content];
        newContent[index] = value;
        return { ...section, content: newContent };
      }
      return section;
    }));
  };

  const handleSave = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const mainDiv = doc.querySelector('div[class*="max-w"]');
    
    if (!mainDiv) return;

    sections.forEach(section => {
      const sectionEl = Array.from(mainDiv.children).find(el => {
        const h2 = el.querySelector('h2');
        return h2?.textContent === section.title || 
          (section.title === 'Header' && el.tagName === 'HEADER');
      });

      if (!sectionEl) return;

      if (section.title === 'Header') {
        const h1 = sectionEl.querySelector('h1');
        if (h1) h1.textContent = section.content[0];
        
        const contactDiv = sectionEl.querySelector('div[class*="text-gray-600"]');
        if (contactDiv) {
          const spans = section.content[1].split(' | ').map(text => {
            const span = document.createElement('span');
            span.textContent = text;
            return span;
          });
          
          contactDiv.innerHTML = '';
          spans.forEach((span, i) => {
            contactDiv.appendChild(span);
            if (i < spans.length - 1) {
              contactDiv.appendChild(document.createTextNode(' | '));
            }
          });
        }
      } else {
        switch (section.type) {
          case 'experience':
            const experienceItems = sectionEl.querySelectorAll('div[class*="mb-6"]');
            for (let i = 0; i < section.content.length; i += 3) {
              const item = experienceItems[i / 3];
              if (item) {
                const [title, date] = section.content[i].split(' | ');
                item.querySelector('h3')!.textContent = title;
                item.querySelector('div[class*="text-gray-600"]')!.textContent = date;
                item.querySelector('div[class*="text-gray-700"]')!.textContent = section.content[i + 1];
                item.querySelector('div[class*="whitespace-pre-line"]')!.textContent = section.content[i + 2];
              }
            }
            break;

          case 'education':
            const educationItems = sectionEl.querySelectorAll('div[class*="mb-4"]');
            for (let i = 0; i < section.content.length; i += 3) {
              const item = educationItems[i / 3];
              if (item) {
                const [degree, date] = section.content[i].split(' | ');
                item.querySelector('h3')!.textContent = degree;
                if (date) item.querySelector('span[class*="text-gray-600"]')!.textContent = date;
                item.querySelector('div[class*="text-gray-700"]')!.textContent = section.content[i + 1];
                if (section.content[i + 2]) {
                  item.querySelector('div[class*="text-gray-600"]')!.textContent = section.content[i + 2];
                }
              }
            }
            break;

          case 'skills':
            const skillsDiv = sectionEl.querySelector('div[class*="text-gray-700"]');
            const certsList = sectionEl.querySelector('ul');
            
            if (skillsDiv) {
              skillsDiv.textContent = section.content[0];
            }
            
            if (certsList && section.content.length > 1) {
              certsList.innerHTML = section.content
                .slice(1)
                .map(cert => `<li>${cert}</li>`)
                .join('');
            }
            break;

          case 'list':
            const ul = sectionEl.querySelector('ul');
            if (ul) {
              ul.innerHTML = section.content
                .map(item => `<li>${item}</li>`)
                .join('');
            }
            break;

          case 'text':
            const paragraphs = sectionEl.querySelectorAll('p');
            section.content.forEach((content, i) => {
              if (paragraphs[i]) {
                paragraphs[i].textContent = content;
              }
            });
            break;
        }
      }
    });

    onSave(mainDiv.outerHTML);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-4/5 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Edit Resume Content</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-6 max-h-[600px] overflow-y-auto">
          {sections.map((section) => (
            <div key={section.id} className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">{section.title}</h4>
              <div className="space-y-3">
                {section.content.map((text, index) => (
                  <div key={`${section.id}-${index}`}>
                    <textarea
                      value={text}
                      onChange={(e) => handleContentChange(section.id, index, e.target.value)}
                      className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      rows={text.length > 100 ? 4 : 2}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}