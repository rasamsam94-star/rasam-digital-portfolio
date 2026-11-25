(() => {
  const revealItems = document.querySelectorAll('.support-page .reveal');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealItems.forEach(item => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => observer.observe(item));
  }

  const modal = document.getElementById('preview-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.getElementById('modal-content');
  let lastTrigger = null;

  const previews = {
    inbox: {
      title: 'Inbox organization — selected evidence',
      html: `<p class="preview-note">Personal inbox details have been softened for portfolio privacy. The screenshots remain visual evidence of the Gmail task workflow.</p>
        <div class="preview-images">
          <figure><img src="../assets/support-system/inbox-after.png" alt="Softened Gmail inbox screenshot after organization"><figcaption>INBOX AFTER CLEANUP</figcaption></figure>
          <figure><img src="../assets/support-system/labels-and-filter.png" alt="Softened Gmail label and filter evidence"><figcaption>LABELS AND FILTERS</figcaption></figure>
          <figure><img src="../assets/support-system/filter-setup.png" alt="Softened Gmail filter setup screenshot"><figcaption>FILTER SETUP</figcaption></figure>
          <figure><img src="../assets/support-system/auto-response.png" alt="Softened Gmail auto-response setup screenshot"><figcaption>AUTO-RESPONSE SETUP</figcaption></figure>
          <figure><img src="../assets/support-system/response-confirmation.png" alt="Softened Gmail auto-response confirmation screenshot"><figcaption>RESPONSE CONFIRMATION</figcaption></figure>
        </div>`
    },
    email: {
      title: 'Professional email response — exercise preview',
      html: `<p class="preview-note">This is a privacy-edited reading preview of a separate written sample in the supplied materials. It covers a clinic lease and relocation schedule; it is not the tenant studio-contract prompt shown in the course task screenshot. Personal and business identifiers are generalized.</p>
        <div class="email-preview"><h3>Subject: Lease agreement renewal, unit inspection schedule, and relocation plan</h3>
        <p>Dear Mr. M.,</p><p>I hope this message finds you well.</p><p>Regarding the upcoming lease renewal and operational relocation, here are the proposed dates for your reference:</p>
        <ul><li><strong>Lease agreement signing:</strong> 5 August — final review and signing of the agreement.</li><li><strong>New location walkthrough:</strong> 20 August and 22 August — inspection of the unit, layout review, and technical coordination for the clinic facilities.</li></ul>
        <p>Please let us know your availability for these dates. If another time is more convenient, feel free to suggest an alternative.</p><p>Thank you for your time and cooperation.</p><p>Best regards,<br>Clinic Management</p></div>`
    },
    charter: {
      title: 'Project Charter — readable preview',
      html: `<p class="preview-note">Summary transcribed from the supplied Project Charter document. The event is a proposed course simulation, not a completed event.</p>
        <div class="charter-preview-grid">
          <div><span>PROJECT</span><strong>International Women’s Day VIP Client Celebration</strong></div>
          <div><span>PROJECT MANAGER</span><strong>RASAM</strong></div>
          <div><span>PLANNING PERIOD</span><strong>6 weeks</strong></div>
          <div><span>GUEST TARGET</span><strong>30 VIP clients</strong></div>
          <div><span>OBJECTIVES</span><strong>Strengthen client relationships, engagement, and satisfaction</strong></div>
          <div><span>ESTIMATED BUDGET IN CHARTER</span><strong>US$4,500</strong></div>
        </div>
        <h3 style="margin-top:22px">Core deliverables</h3><ul><li>Approved event concept and guest experience</li><li>Venue selection and booking</li><li>Catering and vendor coordination</li><li>Invitations and RSVP tracking for 30 VIP clients</li><li>Guest speaker and event activities</li><li>VIP gift bags and event-day plan</li><li>Post-event thank-you message, feedback collection, and review</li></ul>
        <h3>Risk planning</h3><p>The charter identifies risks including low RSVP rates, venue unavailability, catering issues, speaker cancellation, vendor delays, budget overruns, last-minute cancellations, technical problems, poor guest experience, and emergency or safety issues.</p>
        <h3>Proposed success metrics</h3><p>30 clients invited; target attendance of at least 80%; target satisfaction average of 4.5/5 or higher; all invitations tracked; event within approved budget; critical vendors confirmed; and positive client participation and feedback.</p>`
    },
    workbook: {
      title: 'Gantt workbook — source validation note',
      html: `<p class="preview-note">The workbook was inspected before being considered for public portfolio use. It is intentionally not shown as a verified project schedule or financial plan.</p>
        <h3>What was found</h3><ul><li>The Gantt sheet is titled for the Women’s Day VIP Client Celebration, but its first task row refers to visa and immigration matters, which is unrelated to the event.</li><li>The Budget tab contains entries such as legal documents, opening a bank account, moving company costs, team salaries, and transportation — items from a different project template.</li><li>The workbook budget figures therefore do not reconcile with the US$4,500 estimate in the Project Charter.</li></ul>
        <h3>Portfolio treatment</h3><p>The Project Charter is used as the primary planning evidence. The Gantt workbook should be corrected and checked before its schedule or budget is published as a supporting deliverable.</p>`
    }
  };

  function openPreview(key, trigger) {
    const item = previews[key];
    if (!item) return;
    lastTrigger = trigger || document.activeElement;
    modalTitle.textContent = item.title;
    modalContent.innerHTML = item.html;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-close').focus();
  }
  function closePreview() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modalContent.innerHTML = '';
    if (lastTrigger && typeof lastTrigger.focus === 'function') lastTrigger.focus();
  }
  document.querySelectorAll('[data-preview]').forEach(button => {
    button.addEventListener('click', () => openPreview(button.dataset.preview, button));
  });
  modal.querySelectorAll('[data-close]').forEach(control => control.addEventListener('click', closePreview));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) closePreview();
  });
})();
