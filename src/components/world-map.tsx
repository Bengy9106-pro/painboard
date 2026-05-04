'use client'
import { useEffect, useRef } from 'react'
import * as d3 from 'd3-geo'
// d3 used for projection and path only
import { feature } from 'topojson-client'
import type { Topology } from 'topojson-specification'
import type { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'

type Props = {
  stats: Record<string, { pains: number; votes: number }>
  lang: string
}

export default function WorldMap({ stats, lang }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const width = svg.clientWidth || 800
    const height = width * 0.5

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

    const projection = d3.geoNaturalEarth1()
      .scale(width / 6.5)
      .translate([width / 2, height / 2])

    const path = d3.geoPath().projection(projection)

    const maxPains = Math.max(...Object.values(stats).map(s => s.pains), 1)

    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then((world: Topology) => {
        const countries = feature(world, world.objects.countries) as FeatureCollection<Geometry, GeoJsonProperties>
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark'

        while (svg.firstChild) svg.removeChild(svg.firstChild)

        const sphere = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        sphere.setAttribute('d', path({ type: 'Sphere' }) || '')
        sphere.setAttribute('fill', isDark ? '#1a1a1f' : '#e8f4f8')
        svg.appendChild(sphere)

        const graticule = d3.geoGraticule()()
        const grat = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        grat.setAttribute('d', path(graticule) || '')
        grat.setAttribute('fill', 'none')
        grat.setAttribute('stroke', isDark ? '#ffffff08' : '#00000008')
        svg.appendChild(grat)

        countries.features.forEach((feat) => {
          const el = document.createElementNS('http://www.w3.org/2000/svg', 'path')
          const d = path(feat)
          if (!d) return
          el.setAttribute('d', d)
          el.setAttribute('stroke', isDark ? '#2a2a35' : '#ffffff')
          el.setAttribute('stroke-width', '0.4')

          const numId = String((feat as { id?: string | number }).id ?? '').padStart(3, '0')
          const alpha2 = numericToAlpha2[numId]
          const countryData = alpha2 ? stats[alpha2] : null

          if (countryData) {
            const intensity = countryData.pains / maxPains
            const r = Math.round(229 * intensity + (isDark ? 42 : 200) * (1 - intensity))
            const g = Math.round(70 * intensity + (isDark ? 42 : 220) * (1 - intensity))
            const b = Math.round(28 * intensity + (isDark ? 53 : 235) * (1 - intensity))
            el.setAttribute('fill', `rgb(${r},${g},${b})`)

            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title')
            title.textContent = `${alpha2}: ${countryData.pains} ${lang === 'es' ? 'problemas' : 'pains'} · ${countryData.votes} votos`
            el.appendChild(title)
          } else {
            el.setAttribute('fill', isDark ? '#22211f' : '#d4d1ca')
          }

          svg.appendChild(el)
        })
      })
      .catch(() => {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        text.setAttribute('x', '50%')
        text.setAttribute('y', '50%')
        text.setAttribute('text-anchor', 'middle')
        text.setAttribute('fill', 'currentColor')
        text.textContent = lang === 'es' ? 'No se pudo cargar el mapa' : 'Map failed to load'
        svg.appendChild(text)
      })
  }, [stats, lang])

  return (
    <svg
      ref={svgRef}
      className="w-full rounded-xl"
      style={{ minHeight: '300px' }}
    />
  )
}

const numericToAlpha2: Record<string, string> = {
  '004':'AF','008':'AL','012':'DZ','024':'AO','032':'AR','036':'AU','040':'AT','050':'BD',
  '056':'BE','068':'BO','076':'BR','100':'BG','116':'KH','120':'CM','124':'CA','152':'CL',
  '156':'CN','170':'CO','188':'CR','191':'HR','192':'CU','203':'CZ','208':'DK','218':'EC',
  '818':'EG','222':'SV','231':'ET','246':'FI','250':'FR','276':'DE','288':'GH','300':'GR',
  '320':'GT','332':'HT','340':'HN','348':'HU','356':'IN','360':'ID','364':'IR','368':'IQ',
  '372':'IE','376':'IL','380':'IT','388':'JM','392':'JP','400':'JO','398':'KZ','404':'KE',
  '410':'KR','408':'KP','414':'KW','418':'LA','422':'LB','430':'LR','434':'LY','484':'MX',
  '504':'MA','508':'MZ','516':'NA','524':'NP','528':'NL','554':'NZ','558':'NI','566':'NG',
  '578':'NO','586':'PK','591':'PA','600':'PY','604':'PE','608':'PH','616':'PL','620':'PT',
  '630':'PR','634':'QA','642':'RO','643':'RU','682':'SA','686':'SN','694':'SL','706':'SO',
  '710':'ZA','724':'ES','144':'LK','729':'SD','752':'SE','756':'CH','760':'SY','762':'TJ',
  '764':'TH','780':'TT','788':'TN','792':'TR','800':'UG','804':'UA','784':'AE','826':'GB',
  '840':'US','858':'UY','860':'UZ','862':'VE','704':'VN','887':'YE','894':'ZM','716':'ZW',
  '496':'MN'
}
