import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { appConfig } from '@/lib/config'

function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-6xl md:text-7xl font-heading leading-tight">
            WELCOME TO
            <br />
            <span className="text-main">SIPALING</span>
          </h1>
          <p className="text-lg md:text-xl font-base max-w-2xl mx-auto text-foreground/80">
            {appConfig.fullName}
          </p>
          <p className="text-xl md:text-2xl font-base max-w-2xl mx-auto">
            {appConfig.description}
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link to="/about">
              <Button size="lg" variant="default">
                Pelajari Lebih Lanjut
              </Button>
            </Link>
            <Button size="lg" variant="neutral">
              Mulai
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-main">
            <CardHeader>
              <CardTitle className="text-2xl">Analisis Data</CardTitle>
              <CardDescription className="text-main-foreground/80">
                Algoritma clustering canggih untuk data ketahanan pangan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-base">
                Analisis pola dan tren dalam data ketahanan pangan menggunakan machine learning.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-main">
            <CardHeader>
              <CardTitle className="text-2xl">Visualisasi</CardTitle>
              <CardDescription className="text-main-foreground/80">
                Grafik dan chart interaktif
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-base">
                Visualisasikan data Anda dengan grafik dan chart yang indah dan interaktif.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-main">
            <CardHeader>
              <CardTitle className="text-2xl">Wawasan</CardTitle>
              <CardDescription className="text-main-foreground/80">
                Dapatkan wawasan yang dapat ditindaklanjuti dari data Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-base">
                Temukan pola tersembunyi dan dapatkan wawasan untuk meningkatkan ketahanan pangan.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-3xl mx-auto bg-main">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl">Siap Memulai?</CardTitle>
            <CardDescription className="text-main-foreground/80 text-lg">
              Mulai analisis data ketahanan pangan Anda hari ini
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <Button size="lg" variant="reverse">
              Jelajahi Fitur
            </Button>
            <Link to="/about">
              <Button size="lg" variant="neutral">
                Tentang Kami
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default Home
