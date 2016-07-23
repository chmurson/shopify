/**
 * When _expect_ to get info about order from _our_ servers but we can't for some reason
 * @param refreshUrl
 * @returns {string}
 */
export function createServerError() {
  return `
    <h2 class="os-step__title error">Błąd serwera</h2>
    <p class="error">Nie mogliśmy połączyć się z serwerem przez co nie wiemy jaki jest status płatności PayU.
      Spróbuj za chwilę odświerzyć stronę. Możliwe, że to tylko chwilowe problemy. Jeśli problem nie ustępuje, 
      skontaktuj się z nami.
    </p>
    <p><a href="${window.location.href}">Spróbuj jeszcze raz</a></p>
  `;
}

/**
 * When any other error appears. Like error message from PayU, or wrong data about order status
 * @returns {string}
 */
export function createSomeError() {
  return `
    <h2 class="os-step__title error">Błąd serwera</h2>
    <p>W trakcie przetwarzania transakcji PayU wystąpił błąd.</p>
    <p>Kliknij <a href="${window.location.href}">tutaj</a>, aby spróbować jeszcze raz.</p>
    <p>Jeśli problem nie ustąpi, skontaktuj się z nami.</p>
  `;
}

/**
 * for order with CREATED status
 * @param payUUrl
 * @returns {string}
 */
export function createCreatedMessage(payUUrl) {
  return `
    <p>Za chwilę zostaniesz przekierowany na strone PayU gdzię będziesz mógł dokonał opłaty.</p>
    <p>Jeśli tak się nie stanie, możesz się przenieść klikając <a id="navigate-to-payu" href="${payUUrl}">tutaj</a></p>    
  `;
}

/**
 * for order with REJECTED status
 * @returns {string}
 */
export function createRejectedMessage() {
  return `
    <h2 class="os-step__title error">Płatność została odrzucona</h2>
    <p>Płatność została odrzucona, ale prawdopodobnie Twoje konto zostało obciążone. W razie wątpliwości prosimy o kontakt.</p>
  `;
}

/**
 * for order with COMPLETED status
 * @returns {string}
 */
export function createCompletedMessage() {
  return `
    <p>Płatność za zamowienie została zakceptowana. Dziękujemy.</p>
  `;
}

/**
 * for order with CANCELED status
 * @returns {string}
 */
export function createCanceledMessage() {
  return `
    <h2 class="os-step__title error">Płatność została anulowana</h2>
    <p>Płatność została anulowana, Twoje konto nie zostało obciążone. W razie wątpliwości prosimy o kontakt.</p>
  `;
}

/**
 * for order with WAITING_FOR_CONFIRMATION status
 * @returns {string}
 */
export function createWaitingForConfirmationMessage() {
  return `
    <p>Płatność wymaga potwierdzenia. W razie wątpliwości prosimy o kontakt.</p>
  `;
}

/**
 * for order with WAITING_FOR_CONFIRMATION status
 * @returns {string}
 */
export function createPendingMessage() {
  return `
    <p>Płatność jest w trakcie rozliczenia.</p>
  `;
}