class SubscriptionCalculator extends HTMLElement {
  static observedAttributes = ['base-price', 'discount', 'currency-code'];

  connectedCallback() {
    this.render();
    this.querySelector('[data-quantity]').addEventListener('input', () => this.update());
    this.querySelector('[data-frequency]').addEventListener('change', () => this.update());
    this.update();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.update();
  }

  get basePrice() {
    return Number(this.getAttribute('base-price')) || 0;
  }

  get discountPercent() {
    return Number(this.getAttribute('discount')) || 0;
  }

  get currencyCode() {
    return this.getAttribute('currency-code') || 'USD';
  }

  get formatter() {
    return new Intl.NumberFormat(navigator.language || 'ja-JP', {
      style: 'currency',
      currency: this.currencyCode,
      maximumFractionDigits: 0,
    });
  }

  render() {
    this.innerHTML = `
      <div class="calc__row">
        <label class="calc__label" for="calc-qty">1 回の袋数</label>
        <input id="calc-qty" data-quantity type="number" min="1" max="20" value="2" inputmode="numeric">
      </div>
      <div class="calc__row">
        <label class="calc__label" for="calc-freq">お届け頻度</label>
        <select id="calc-freq" data-frequency>
          <option value="weekly">毎週</option>
          <option value="biweekly" selected>2 週ごと</option>
          <option value="monthly">毎月</option>
        </select>
      </div>
      <div class="calc__result">
        <div class="calc__result-row">
          <span>単品購入</span>
          <span data-one-time></span>
        </div>
        <div class="calc__result-row calc__result-row--highlight">
          <span>定期便</span>
          <span data-subscription></span>
        </div>
        <div class="calc__savings" data-savings></div>
      </div>
    `;
  }

  update() {
    const qty = Math.max(1, Number(this.querySelector('[data-quantity]').value) || 1);
    const freq = this.querySelector('[data-frequency]').value;
    const shipmentsPerMonth = { weekly: 4, biweekly: 2, monthly: 1 }[freq] || 1;

    const oneTimeMonthly = this.basePrice * qty * shipmentsPerMonth;
    const subscriptionUnit = this.basePrice * (100 - this.discountPercent) / 100;
    const subscriptionMonthly = subscriptionUnit * qty * shipmentsPerMonth;
    const monthlySavings = oneTimeMonthly - subscriptionMonthly;

    this.querySelector('[data-one-time]').textContent = this.format(oneTimeMonthly);
    this.querySelector('[data-subscription]').textContent = this.format(subscriptionMonthly);
    this.querySelector('[data-savings]').textContent =
      `1 か月あたりの差額: ${this.format(monthlySavings)}`;
  }

  format(amount) {
    return this.formatter.format(amount);
  }
}

customElements.define('subscription-calculator', SubscriptionCalculator);
