import type { Ref } from '../../ui/Cite'
import { COMMON } from '../../content/refs'

const L2 = {
  patterson1914: {
    key: 'patterson1914', kind: 'article', authors: 'Patterson, S. W., & Starling, E. H.', short: 'Patterson & Starling', year: '1914',
    title: 'On the mechanical factors which determine the output of the ventricles',
    container: 'The Journal of Physiology', volume: '48', issue: '5', pages: '357–379', doi: '10.1113/jphysiol.1914.sp001669',
  },
  kelly1992: {
    key: 'kelly1992', kind: 'article',
    authors: 'Kelly, R. P., Ting, C. T., Yang, T. M., Liu, C. P., Maughan, W. L., Chang, M. S., & Kass, D. A.',
    short: 'Kelly et al.', year: '1992',
    title: 'Effective arterial elastance as index of arterial vascular load in humans',
    container: 'Circulation', volume: '86', issue: '2', pages: '513–521', doi: '10.1161/01.CIR.86.2.513',
  },
  chantler2008: {
    key: 'chantler2008', kind: 'article', authors: 'Chantler, P. D., Lakatta, E. G., & Najjar, S. S.', short: 'Chantler et al.', year: '2008',
    title: 'Arterial-ventricular coupling: Mechanistic insights into cardiovascular performance at rest and during exercise',
    container: 'Journal of Applied Physiology', volume: '105', issue: '4', pages: '1342–1351', doi: '10.1152/japplphysiol.90600.2008',
  },
  burkhoff1986: {
    key: 'burkhoff1986', kind: 'article', authors: 'Burkhoff, D., & Sagawa, K.', short: 'Burkhoff & Sagawa', year: '1986',
    title: 'Ventricular efficiency predicted by an analytical model',
    container: 'American Journal of Physiology', volume: '250', issue: '6', pages: 'R1021–R1027', doi: '10.1152/ajpregu.1986.250.6.R1021',
  },
  burkhoff2005: {
    key: 'burkhoff2005', kind: 'article', authors: 'Burkhoff, D., Mirsky, I., & Suga, H.', short: 'Burkhoff et al.', year: '2005',
    title: 'Assessment of systolic and diastolic ventricular properties via pressure-volume analysis: A guide for clinical, translational, and basic researchers',
    container: 'American Journal of Physiology: Heart and Circulatory Physiology', volume: '289', issue: '2', pages: 'H501–H512', doi: '10.1152/ajpheart.00138.2005',
  },
  walley2016: {
    key: 'walley2016', kind: 'article', authors: 'Walley, K. R.', short: 'Walley', year: '2016',
    title: 'Left ventricular function: Time-varying elastance and left ventricular aortic coupling',
    container: 'Critical Care', volume: '20', pages: 'Article 270', doi: '10.1186/s13054-016-1439-6',
  },
  suga1990: {
    key: 'suga1990', kind: 'article', authors: 'Suga, H.', short: 'Suga', year: '1990',
    title: 'Ventricular energetics',
    container: 'Physiological Reviews', volume: '70', issue: '2', pages: '247–277', doi: '10.1152/physrev.1990.70.2.247',
  },
  sagawa1978: {
    key: 'sagawa1978', kind: 'article', authors: 'Sagawa, K.', short: 'Sagawa', year: '1978',
    title: 'The ventricular pressure-volume diagram revisited',
    container: 'Circulation Research', volume: '43', issue: '5', pages: '677–687', doi: '10.1161/01.RES.43.5.677',
  },
  bers2002: {
    key: 'bers2002', kind: 'article', authors: 'Bers, D. M.', short: 'Bers', year: '2002',
    title: 'Cardiac excitation-contraction coupling',
    container: 'Nature', volume: '415', issue: '6868', pages: '198–205', doi: '10.1038/415198a',
  },
  detombe2010: {
    key: 'detombe2010', kind: 'article',
    authors: 'de Tombe, P. P., Mateja, R. D., Tachampa, K., Ait Mou, Y., Farman, G. P., & Irving, T. C.',
    short: 'de Tombe et al.', year: '2010',
    title: 'Myofilament length dependent activation',
    container: 'Journal of Molecular and Cellular Cardiology', volume: '48', issue: '5', pages: '851–858', doi: '10.1016/j.yjmcc.2009.12.017',
  },
  berlin2015: {
    key: 'berlin2015', kind: 'article', authors: 'Berlin, D. A., & Bakker, J.', short: 'Berlin & Bakker', year: '2015',
    title: 'Starling curves and central venous pressure',
    container: 'Critical Care', volume: '19', pages: 'Article 55', doi: '10.1186/s13054-015-0776-1',
  },
  lang2015: {
    key: 'lang2015', kind: 'article',
    authors: 'Lang, R. M., Badano, L. P., Mor-Avi, V., Afilalo, J., Armstrong, A., Ernande, L., Flachskampf, F. A., Foster, E., Goldstein, S. A., Kuznetsova, T., Lancellotti, P., Muraru, D., Picard, M. H., Rietzschel, E. R., Rudski, L., Spencer, K. T., Tsang, W., & Voigt, J.-U.',
    short: 'Lang et al.', year: '2015',
    title: 'Recommendations for cardiac chamber quantification by echocardiography in adults: An update from the American Society of Echocardiography and the European Association of Cardiovascular Imaging',
    container: 'Journal of the American Society of Echocardiography', volume: '28', issue: '1', pages: '1–39.e14', doi: '10.1016/j.echo.2014.10.003',
  },
  brown2005: {
    key: 'brown2005', kind: 'article', authors: 'Brown, J., & Morgan-Hughes, N. J.', short: 'Brown & Morgan-Hughes', year: '2005',
    title: 'Aortic stenosis and non-cardiac surgery',
    container: 'Continuing Education in Anaesthesia Critical Care & Pain', volume: '5', issue: '1', pages: '1–4', doi: '10.1093/bjaceaccp/mki001',
  },
} satisfies Record<string, Ref>

export const R2 = { ...COMMON, ...L2 }

export const L2_REFS: Ref[] = [
  R2.patterson1914, R2.suga1973, R2.suga1974, R2.sagawa1978, R2.sunagawa1983, R2.burkhoff1986, R2.kelly1992, R2.suga1990,
  R2.bers2002, R2.burkhoff2005, R2.chantler2008, R2.detombe2010, R2.lang2015, R2.berlin2015, R2.walley2016, R2.brown2005,
  R2.hall2025,
]
