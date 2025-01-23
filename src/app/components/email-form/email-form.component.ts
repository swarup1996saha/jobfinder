import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterByTestingTypePipe } from "../../pipes/filter-by-testing-type.pipe";

interface ExtractedContact {
  email: string;
  role?: string;
  experience?: string;
  testingType?: 'automation' | 'performance' | 'manual';
  skills?: string[];  // Add skills array
  noticePeriod?: string;  // Add this line
}

@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FilterByTestingTypePipe]
})
export class EmailFormComponent implements OnInit {
  emailForm: FormGroup;
  extractedContacts: ExtractedContact[] = [];
  isProcessing: boolean = false;
  private technicalSkills = {
    // Programming Languages & Core Skills
    'java': 'Java',
    'python': 'Python',
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'c#': 'C#',
    'golang': 'Golang',
    'react': 'ReactJS',
    'node': 'NodeJS',
    'vbscript': 'VBScript',
    'bdd': 'BDD',

    // Automation Tools & Frameworks
    'selenium': 'Selenium WebDriver',
    'appium': 'Appium',
    'cypress': 'Cypress',
    'playwright': 'Playwright',
    'robot framework': 'Robot Framework',
    'cucumber': 'Cucumber',
    'testng': 'TestNG',
    'junit': 'JUnit',
    'xunit': 'xUnit',
    'uft': 'UFT',
    'katalon': 'Katalon',
    'uipath': 'UiPath',
    'specflow': 'SpecFlow',
    'webdriverio': 'WebdriverIO',

    // API & Performance Testing
    'postman': 'Postman',
    'rest assured': 'REST Assured',
    'api testing': 'API Testing',
    'soap': 'SOAP Testing',
    'jmeter': 'JMeter',
    'loadrunner': 'LoadRunner',
    'gatling': 'Gatling',
    'performance testing': 'Performance Testing',
    'load testing': 'Load Testing',

    // DevOps & CI/CD
    'git': 'Git',
    'github': 'GitHub',
    'gitlab': 'GitLab',
    'jenkins': 'Jenkins',
    'docker': 'Docker',
    'kubernetes': 'K8s',
    'aws': 'AWS',
    'azure': 'Azure',
    'ci/cd': 'CI/CD',

    // Databases & Backend
    'sql': 'SQL',
    'plsql': 'PL/SQL',
    'mysql': 'MySQL',
    'postgresql': 'PostgreSQL',
    'oracle': 'Oracle DB',
    'cassandra': 'Cassandra',
    'mongodb': 'MongoDB',
    'kafka': 'Kafka',
    'microservices': 'Microservices',

    // Operating Systems & Infrastructure
    'linux': 'Linux',
    'unix': 'Unix',
    'windows': 'Windows',
    'android': 'Android',
    'ios': 'iOS',

    // Project Management & Tools
    'jira': 'JIRA',
    'agile': 'Agile',
    'scrum': 'Scrum',
    'kanban': 'Kanban',
    'confluence': 'Confluence',
    'sdlc': 'SDLC',
    'stlc': 'STLC',

    // Mobile Testing
    'mobile testing': 'Mobile Testing',
    'android studio': 'Android Studio',
    'react native': 'React Native',
    'flutter': 'Flutter SDK',

    // Specialized Testing
    'accessibility testing': 'Accessibility Testing',
    'security testing': 'Security Testing',
    'etl testing': 'ETL Testing',
    'sap testing': 'SAP Testing',
    'mainframe testing': 'Mainframe Testing',
    'cobol': 'COBOL',
    'cics': 'CICS',
    'db2': 'DB2',
    'white box': 'White Box Testing',
    'regression': 'Regression Testing',
    'functional testing': 'Functional Testing',
    'integration testing': 'Integration Testing',
    'system testing': 'System Testing',
    'uat': 'UAT',
    
    // Domain Specific
    'banking': 'Banking Domain',
    'healthcare': 'Healthcare Domain',
    'retail': 'Retail Domain',
    'pos': 'POS Systems',
    'telecom': 'Telecom Domain',
    'voip': 'VoIP',
    'sip': 'SIP',
    'rtp': 'RTP',
    'webrtc': 'WebRTC'
  };
  // Update email pattern to handle more cases
  emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  rolePatterns = [
    /(?:job|role|position):\s*([^,\n]*)/i,
    /([^,\n]*developer[^,\n]*)/i,
    /([^,\n]*engineer[^,\n]*)/i,
    /([^,\n]*manager[^,\n]*)/i,
    /([^,\n]*analyst[^,\n]*)/i,
    /([^,\n]*designer[^,\n]*)/i
  ];

  constructor(private fb: FormBuilder) {
    this.emailForm = this.fb.group({
      pastedText: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.emailForm.get('pastedText')?.valueChanges.subscribe(text => {
      if (text) {
        this.extractContactInfo(text);
      } else {
        this.extractedContacts = [];
      }
    });
  }

  private extractContactInfo(text: string): void {
    this.isProcessing = true;
    const contacts = new Map<string, ExtractedContact>();

    // Split by separator and clean up
    const jobPosts = text.split(/=+/).map(post => post.trim()).filter(post => post);
    
    jobPosts.forEach((post, index) => {
      console.log(`Processing job post ${index + 1}:`, post); // Debug log
      
      const emailMatches = post.match(this.emailPattern);
      
      if (emailMatches) {
        emailMatches.forEach(email => {
          if (!contacts.has(email)) {
            const role = this.findRole(post);
            const experience = this.findExperience(post);
            const { type: testingType, skills } = this.determineTestingType(post);
            
            console.log({
              email,
              role,
              experience,
              testingType,
              skills
            }); // Debug log
            
            if (this.isExperienceInRange(experience, 0, 4)) {
              contacts.set(email, {
                email,
                role: role || undefined,
                experience: experience || undefined,
                testingType,
                skills,
                noticePeriod: this.findNoticePeriod(post)
              });
            }
          }
        });
      }
    });

    this.extractedContacts = Array.from(contacts.values());
    console.log('Final extracted contacts:', this.extractedContacts); // Debug log
    this.isProcessing = false;
  }

  private findRole(text: string): string | null {
    for (const pattern of this.rolePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return null;
  }

  private findExperience(text: string): string | null {
    const expPatterns = [
      /experience:?\s*(\d+[-–]?\d*\+?)\s*years?/i,
      /exp:?\s*(\d+[-–]?\d*\+?)\s*years?/i,
      /(\d+[-–]?\d*\+?)\s*years?\s*(?:of)?\s*experience/i,
      /experience:\s*(\d+[-–]\d+)\s*Years/i,
      /\b(\d+[-–]\d+)\s*Years?\b/i,
      /(\d+\+?)\s*Years?\b/i
    ];

    for (const pattern of expPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        console.log('Found experience pattern:', pattern);
        console.log('Found experience value:', match[1].trim());
        return match[1].trim();
      }
    }
    return null;
  }

  private determineTestingType(text: string): { type: 'automation' | 'performance' | 'manual' | undefined, skills: string[] } {
    const textLower = text.toLowerCase();
    const skills: string[] = [];

    // Testing type keywords
    const performanceKeywords = [
        'performance testing', 
        'load testing', 
        'jmeter', 
        'loadrunner', 
        'performance engineer', 
        'stress testing',
        'performance test'
    ];
    
    const manualKeywords = [
        'manual testing',
        'manual qa',
        'test cases',
        'test execution',
        'functional testing',
        'test scenarios',
        'manual test',
        'manual quality'
    ];
    
    const automationKeywords = [
        'automation testing',
        'selenium',
        'automation framework',
        'test automation',
        'automated testing',
        'automation engineer',
        'cypress',
        'playwright'
    ];

    // Set initial type as undefined
    let type: 'automation' | 'performance' | 'manual' | undefined = undefined;

    // Check for testing types in order
    if (performanceKeywords.some(keyword => textLower.includes(keyword))) {
        type = 'performance';
    } else if (manualKeywords.some(keyword => textLower.includes(keyword))) {
        type = 'manual';
    } else if (automationKeywords.some(keyword => textLower.includes(keyword)) || 
              (textLower.includes('automation') && textLower.includes('testing'))) {
        type = 'automation';
    }

    // Special case checks
    if (!type) {
        if (textLower.includes('jmeter') || textLower.includes('loadrunner')) {
            type = 'performance';
        } else if (textLower.includes('test case') || textLower.includes('test plan')) {
            type = 'manual';
        }
    }

    // Collect skills
    for (const [keyword, skill] of Object.entries(this.technicalSkills)) {
        if (textLower.includes(keyword) && !skills.includes(skill)) {
            skills.push(skill);
        }
    }

    console.log('Processing text:', text.substring(0, 100) + '...');
    console.log('Detected type:', type);
    console.log('Detected skills:', skills);

    return { type, skills };
  }

  private isExperienceInRange(exp: string | null, min: number, max: number): boolean {
    if (!exp) return false;
    
    // Handle ranges like "3-8" or "3–8"
    if (exp.includes('-') || exp.includes('–')) {
      const [start] = exp.split(/[-–]/).map(num => parseFloat(num));
      return !isNaN(start) && start <= max;
    }
    
    // Handle "+" cases like "3+"
    if (exp.includes('+')) {
      const baseNumber = parseFloat(exp.replace('+', ''));
      return !isNaN(baseNumber) && baseNumber <= max;
    }
    
    // Handle single numbers
    const number = parseFloat(exp);
    return !isNaN(number) && number <= max;
  }

  private findNoticePeriod(text: string): string | undefined {
    const textLower = text.toLowerCase();
    const npPatterns = [
      /notice\s*period\s*[-:]?\s*(immediate|(?:\d+\s*(?:to\s*)?\d*\s*days?))/i,
      /np\s*[-:]?\s*(immediate|(?:\d+\s*(?:to\s*)?\d*\s*days?))/i,
      /(?:joining|notice)\s*[-:]?\s*(immediate)/i
    ];
  
    for (const pattern of npPatterns) {
      const match = textLower.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  
    if (textLower.includes('immediate joiner') || 
        textLower.includes('immediate joining')) {
      return 'immediate';
    }
  
    return undefined;
  }

  copyEmail(email: string) {
    navigator.clipboard.writeText(email).then(() => {
      alert('Email address copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy email:', err);
    });
  }

  copyEmailTemplate(contact: ExtractedContact) {
    const testingType = contact.testingType ? 
      `${contact.testingType.charAt(0).toUpperCase() + contact.testingType.slice(1)} Testing` : 
      'Software Testing';

    const template = `Application for ${testingType} Position

Dear Hiring Manager,

I saw an advertisement for the role of ${testingType} in your company. The position is a great opportunity for me. I have 4+ years of experience in ${testingType}.

Please find my details below:

1. Full Name: Nupoor Singh
2. Email ID: kumarinupoor55@gmail.com
3. Contact Number: +917063520483
4. Total Experience: 4+ years
5. Notice Period: 30 Days
6. Current Location: Kolkata
7. Preferred Interview Location: Kolkata
8. Current/Last Employer: Ancile Technologies
9. Date of Birth: 02/02/1992
10. Key Skills: ${contact.skills?.join(', ') || testingType}

Please find my resume attached for your consideration.

Please let me know if you require any additional information. Looking forward to hearing from you.

Thank you for your time and consideration.

Best regards,
Nupoor Singh
+917063520483`;

    navigator.clipboard.writeText(template).then(() => {
      alert('Email template copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy template:', err);
    });
  }

  clearForm(): void {
    this.emailForm.patchValue({
      pastedText: ''
    });
    this.extractedContacts = [];
  }

  onTextPasted() {
    const pastedText = this.emailForm.get('pastedText')?.value;
    if (pastedText) {
      this.extractContactInfo(pastedText);
    }
  }
}
