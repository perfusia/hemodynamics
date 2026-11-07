import type { Ref } from '../../ui/Cite'
import { COMMON } from '../../content/refs'

const L4 = {
  henderson2010: {
    key: 'henderson2010', kind: 'article', authors: 'Henderson, W. R., Griesdale, D. E. G., Walley, K. R., & Sheel, A. W.', short: 'Henderson et al.', year: '2010',
    title: 'Clinical review: Guyton, the role of mean circulatory filling pressure and right atrial pressure in controlling cardiac output',
    container: 'Critical Care', volume: '14', issue: '6', pages: 'Article 243', doi: '10.1186/cc9247',
  },
  berlin2015: {
    key: 'berlin2015', kind: 'article', authors: 'Berlin, D. A., & Bakker, J.', short: 'Berlin & Bakker', year: '2015',
    title: 'Starling curves and central venous pressure',
    container: 'Critical Care', volume: '19', pages: 'Article 55', doi: '10.1186/s13054-015-0776-1',
  },
  marik2008: {
    key: 'marik2008', kind: 'article', authors: 'Marik, P. E., Baram, M., & Vahid, B.', short: 'Marik et al.', year: '2008',
    title: 'Does central venous pressure predict fluid responsiveness? A systematic review of the literature and the tale of seven mares',
    container: 'Chest', volume: '134', issue: '1', pages: '172–178', doi: '10.1378/chest.07-2331',
  },
  michard2002: {
    key: 'michard2002', kind: 'article', authors: 'Michard, F., & Teboul, J.-L.', short: 'Michard & Teboul', year: '2002',
    title: 'Predicting fluid responsiveness in ICU patients: A critical analysis of the evidence',
    container: 'Chest', volume: '121', issue: '6', pages: '2000–2008', doi: '10.1378/chest.121.6.2000',
  },
  marik2009: {
    key: 'marik2009', kind: 'article', authors: 'Marik, P. E., Cavallazzi, R., Vasu, T., & Hirani, A.', short: 'Marik et al.', year: '2009',
    title: 'Dynamic changes in arterial waveform derived variables and fluid responsiveness in mechanically ventilated patients: A systematic review of the literature',
    container: 'Critical Care Medicine', volume: '37', issue: '9', pages: '2642–2647', doi: '10.1097/CCM.0b013e3181a590da',
  },
  cannesson2011: {
    key: 'cannesson2011', kind: 'article',
    authors: 'Cannesson, M., Le Manach, Y., Hofer, C. K., Goarin, J. P., Lehot, J.-J., Vallet, B., & Tavernier, B.',
    short: 'Cannesson et al.', year: '2011',
    title: 'Assessing the diagnostic accuracy of pulse pressure variations for the prediction of fluid responsiveness: A "gray zone" approach',
    container: 'Anesthesiology', volume: '115', issue: '2', pages: '231–241', doi: '10.1097/ALN.0b013e318225b80a',
  },
  monnet2016: {
    key: 'monnet2016', kind: 'article', authors: 'Monnet, X., Marik, P. E., & Teboul, J.-L.', short: 'Monnet et al.', year: '2016',
    title: 'Prediction of fluid responsiveness: An update',
    container: 'Annals of Intensive Care', volume: '6', issue: '1', pages: 'Article 111', doi: '10.1186/s13613-016-0216-7',
  },
  pinsky2018: {
    key: 'pinsky2018', kind: 'article', authors: 'Pinsky, M. R.', short: 'Pinsky', year: '2018',
    title: 'Cardiopulmonary interactions: Physiologic basis and clinical applications',
    container: 'Annals of the American Thoracic Society', volume: '15', issue: 'Supplement 1', pages: 'S45–S48', doi: '10.1513/AnnalsATS.201704-339FR',
  },
} satisfies Record<string, Ref>

export const R4 = { ...COMMON, ...L4 }

export const L4_REFS: Ref[] = [
  R4.guyton1955, R4.henderson2010, R4.magder2016, R4.berlin2015, R4.marik2008, R4.michard2002, R4.marik2009,
  R4.cannesson2011, R4.monnet2016, R4.pinsky2018, R4.hall2025,
]
