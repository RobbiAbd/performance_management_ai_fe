import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { appConfig } from '@/lib/config'

function About() {
  return (
    <div className="min-h-screen container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-heading">TENTANG SIPALING</h1>
          <p className="text-lg font-base text-foreground/80">
            {appConfig.fullName}
          </p>
          <p className="text-xl font-base">
            Pelajari lebih lanjut tentang misi dan visi kami
          </p>
        </div>

        <Card className="bg-main">
          <CardHeader>
            <CardTitle className="text-3xl">Tentang SIPALING</CardTitle>
            <CardDescription className="text-main-foreground/80">
              {appConfig.fullName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-base">
              SIPALING adalah platform sistem pemetaan yang didedikasikan untuk meningkatkan ketahanan pangan 
              nasional melalui analisis data dan machine learning. Kami membantu pemerintah, peneliti, dan 
              komunitas dalam membuat keputusan yang lebih baik terkait pemetaan dan ketahanan pangan nasional.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-main">
          <CardHeader>
            <CardTitle className="text-3xl">Misi Kami</CardTitle>
            <CardDescription className="text-main-foreground/80">
              Memberdayakan ketahanan pangan melalui ilmu data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-base">
              Kami berdedikasi untuk menggunakan machine learning dan analisis data untuk meningkatkan ketahanan pangan 
              dan membantu komunitas dalam membuat keputusan yang lebih baik terkait sumber daya pangan mereka.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-main">
          <CardHeader>
            <CardTitle className="text-3xl">Apa Yang Kami Lakukan</CardTitle>
            <CardDescription className="text-main-foreground/80">
              Clustering dan analisis data canggih
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-base mb-4">
              Platform kami menggunakan algoritma machine learning terkini untuk melakukan clustering dan analisis 
              data ketahanan pangan, memberikan wawasan berharga bagi pembuat kebijakan, peneliti, dan komunitas.
            </p>
            <ul className="list-disc list-inside space-y-2 font-base">
              <li>Clustering data dan pengenalan pola</li>
              <li>Visualisasi data interaktif</li>
              <li>Analitik prediktif</li>
              <li>Laporan dan dashboard yang dapat disesuaikan</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-main">
          <CardHeader>
            <CardTitle className="text-3xl">Teknologi</CardTitle>
            <CardDescription className="text-main-foreground/80">
              Dibangun dengan tools modern
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-base">
              Kami memanfaatkan teknologi terkini termasuk React, algoritma Machine Learning, 
              dan tools visualisasi data modern untuk memberikan pengalaman terbaik.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default About

