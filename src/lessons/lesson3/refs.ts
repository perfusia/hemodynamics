import type { Ref } from '../../ui/Cite'
import { COMMON } from '../../content/refs'

const L3 = {
  pries1996: {
    key: 'pries1996', kind: 'article', authors: 'Pries, A. R., Secomb, T. W., & Gaehtgens, P.', short: 'Pries et al.', year: '1996',
    title: 'Biophysical aspects of blood flow in the microvasculature',
    container: 'Cardiovascular Research', volume: '32', issue: '4', pages: '654–667', doi: '10.1016/S0008-6363(96)00065-X',
  },
  chemla1998: {
    key: 'chemla1998', kind: 'article', authors: 'Chemla, D., Hébert, J.-L., Coirault, C., Zamani, K., Suard, I., Colin, P., & Lecarpentier, Y.', short: 'Chemla et al.', year: '1998',
    title: 'Total arterial compliance estimated by stroke volume-to-aortic pulse pressure ratio in humans',
    container: 'American Journal of Physiology', volume: '274', issue: '2', pages: 'H500–H505', doi: '10.1152/ajpheart.1998.274.2.H500',
  },
  mitchell2010: {
    key: 'mitchell2010', kind: 'article',
    authors: 'Mitchell, G. F., Hwang, S.-J., Vasan, R. S., Larson, M. G., Pencina, M. J., Hamburg, N. M., Vita, J. A., Levy, D., & Benjamin, E. J.',
    short: 'Mitchell et al.', year: '2010',
    title: 'Arterial stiffness and cardiovascular events: The Framingham Heart Study',
    container: 'Circulation', volume: '121', issue: '4', pages: '505–511', doi: '10.1161/CIRCULATIONAHA.109.886655',
  },
  larovere2008: {
    key: 'larovere2008', kind: 'article', authors: 'La Rovere, M. T., Pinna, G. D., & Raczak, G.', short: 'La Rovere et al.', year: '2008',
    title: 'Baroreflex sensitivity: Measurement and clinical implications',
    container: 'Annals of Noninvasive Electrocardiology', volume: '13', issue: '2', pages: '191–207', doi: '10.1111/j.1542-474X.2008.00219.x',
  },
  ebert1992: {
    key: 'ebert1992', kind: 'article', authors: 'Ebert, T. J., Muzi, M., Berens, R., Goff, D., & Kampine, J. P.', short: 'Ebert et al.', year: '1992',
    title: 'Sympathetic responses to induction of anesthesia in humans with propofol or etomidate',
    container: 'Anesthesiology', volume: '76', issue: '5', pages: '725–733', doi: '10.1097/00000542-199205000-00010',
  },
  nichols2011: {
    key: 'nichols2011', kind: 'book', authors: 'Nichols, W. W., O’Rourke, M. F., & Vlachopoulos, C.', short: 'Nichols et al.', year: '2011',
    title: "McDonald's blood flow in arteries: Theoretical, experimental and clinical principles", edition: '6th', publisher: 'Hodder Arnold',
  },
} satisfies Record<string, Ref>

export const R3 = { ...COMMON, ...L3 }

export const L3_REFS: Ref[] = [
  R3.hall2025, R3.pries1996, R3.westerhof2009, R3.chemla1998, R3.nichols2011, R3.mitchell2010, R3.ursino1998, R3.larovere2008, R3.ebert1992,
]
