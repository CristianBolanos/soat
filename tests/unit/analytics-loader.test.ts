import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getGaState, setGaState, trackThenNavigate } from '../../src/lib/analytics';
import {
  ga4ScriptUrl,
  isValidGa4Id,
  loadGa4,
  onFirstInteraction,
} from '../../src/lib/analytics-loader';

describe('validación del ID de GA4', () => {
  it('acepta IDs de GA4 y rechaza el resto', () => {
    expect(isValidGa4Id('G-ABC1234')).toBe(true);
    expect(isValidGa4Id('UA-12345-1')).toBe(false);
    expect(isValidGa4Id('')).toBe(false);
    expect(isValidGa4Id('G-<script>')).toBe(false);
    expect(isValidGa4Id(undefined)).toBe(false);
  });

  it('arma la URL de gtag.js', () => {
    expect(ga4ScriptUrl('G-ABC1234')).toBe('https://www.googletagmanager.com/gtag/js?id=G-ABC1234');
  });
});

describe('onFirstInteraction', () => {
  it('se ejecuta una sola vez, con la primera interacción', () => {
    const target = new EventTarget();
    const callback = vi.fn();
    onFirstInteraction(target, callback);
    target.dispatchEvent(new Event('scroll'));
    target.dispatchEvent(new Event('pointerdown'));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('se puede cancelar antes de que ocurra', () => {
    const target = new EventTarget();
    const callback = vi.fn();
    const cancel = onFirstInteraction(target, callback);
    cancel();
    target.dispatchEvent(new Event('keydown'));
    expect(callback).not.toHaveBeenCalled();
  });
});

class FakeScript extends EventTarget {
  async = false;
  src = '';
}

describe('loadGa4', () => {
  afterEach(() => setGaState('off'));

  function setup() {
    const appended: unknown[] = [];
    const gtag = vi.fn();
    const script = new FakeScript();
    const env = {
      document: {
        createElement: () => script as unknown as HTMLScriptElement,
        head: { appendChild: (node: unknown) => appended.push(node) },
      },
      gtag,
    };
    return { env, gtag, script, appended };
  }

  it('configura GA4 sin señales ni personalización de anuncios y agrega gtag.js', () => {
    const { env, gtag, script, appended } = setup();
    loadGa4('G-ABC1234', env);
    expect(gtag).toHaveBeenCalledWith('config', 'G-ABC1234', {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    expect(script.async).toBe(true);
    expect(script.src).toBe('https://www.googletagmanager.com/gtag/js?id=G-ABC1234');
    expect(appended).toEqual([script]);
    expect(getGaState()).toBe('loading');
  });

  it('pasa a «ready» al cargar y a «off» si falla', () => {
    const ok = setup();
    loadGa4('G-ABC1234', ok.env);
    ok.script.dispatchEvent(new Event('load'));
    expect(getGaState()).toBe('ready');

    const failed = setup();
    loadGa4('G-ABC1234', failed.env);
    failed.script.dispatchEvent(new Event('error'));
    expect(getGaState()).toBe('off');
  });
});

describe('trackThenNavigate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    setGaState('off');
  });

  it('sin GA4 navega de inmediato', () => {
    vi.stubGlobal('window', {});
    const navigate = vi.fn();
    trackThenNavigate('generate_lead', { tipo: 'moto' }, 'https://wa.me/1', { navigate });
    expect(navigate).toHaveBeenCalledWith('https://wa.me/1');
  });

  it('con GA4 navega cuando se confirma el envío, y una sola vez', () => {
    const gtag = vi.fn((_cmd: string, _name: string, params: { event_callback?: () => void }) =>
      params.event_callback?.(),
    );
    vi.stubGlobal('window', { dataLayer: [], gtag });
    setGaState('ready');
    const navigate = vi.fn();
    trackThenNavigate('generate_lead', { tipo: 'carro' }, 'https://wa.me/1', { navigate });
    vi.advanceTimersByTime(1000);
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it('con GA4 lento, navega igual al vencer el tiempo máximo', () => {
    vi.stubGlobal('window', { dataLayer: [], gtag: vi.fn() });
    setGaState('loading');
    const navigate = vi.fn();
    trackThenNavigate('generate_lead', {}, 'https://wa.me/1', { navigate, timeoutMs: 300 });
    expect(navigate).not.toHaveBeenCalled();
    vi.advanceTimersByTime(300);
    expect(navigate).toHaveBeenCalledTimes(1);
  });
});
