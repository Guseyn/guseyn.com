'use strict'

const workerThatProducesUnilangOutputs = new Worker('/js/worker-for-producing-unilang-output.bundle.min.js?v=1.0.0')

const actionOnResponseHandlers = {
  loadingFontsForRenderingSVGsFinished: () => {
    window.dispatchEvent(new CustomEvent('loadingFontsForRenderingSVGsFinished', { detail: true }))
  },
  unilangOutput: (output) => {
    if (output.id) {
      window.dispatchEvent(new CustomEvent(`unilangOutputRetrievedFromWorker-${output.id}`, { detail: output }))
    }
    window.dispatchEvent(new CustomEvent(`unilangOutputRetrievedFromWorker`, { detail: output }))
  }
}

workerThatProducesUnilangOutputs.addEventListener('message', (event) => {
  const actionOnResponse = event.data.actionOnResponse
  const output = event.data.output
  actionOnResponseHandlers[actionOnResponse](output)
})

window.loadFontsForRenderingSVGsViaWorker = (fonts) => {
  workerThatProducesUnilangOutputs.postMessage({ action: 'loadingFontsForRenderingSVGs', actionOnResponse: 'loadingFontsForRenderingSVGsFinished', input: fonts })
}

// id is for cases when we have multiple generation of unilang output on one page, so we can somehow distingush them
window.unilangOutputViaWorker = (unilangInputPages = [{ unilangInputText: '', isRenderedWithLatestUnilangInputText: false }], applyHighlighting = false, generateSVG = true, generateMIDI = false, id = null) => {
  workerThatProducesUnilangOutputs.postMessage({ action: 'unilangOutput', actionOnResponse: 'unilangOutput', input: unilangInputPages, applyHighlighting, generateSVG, generateMIDI, id })
}
