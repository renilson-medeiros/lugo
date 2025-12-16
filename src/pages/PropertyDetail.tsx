import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  PawPrint, 
  Users, 
  Baby,
  Wifi,
  Droplets,
  Zap,
  Flame,
  MessageCircle,
  ArrowLeft,
  Home,
  Maximize
} from "lucide-react";

// Mock data - seria substituído por dados reais
const mockProperty = {
  id: "1",
  title: "Apartamento espaçoso no centro",
  images: [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
  ],
  address: {
    street: "Rua das Flores",
    number: "123",
    complement: "Apto 45",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567"
  },
  details: {
    bedrooms: 2,
    bathrooms: 1,
    area: 75,
    garage: true,
    garageSpots: 1,
    acceptsPets: true,
    maxPeople: 4,
    acceptsChildren: true
  },
  rooms: ["Sala de estar", "Cozinha", "Área de serviço", "Varanda"],
  pricing: {
    rent: 2500,
    condominium: 450,
    iptu: 150,
    serviceFee: 0
  },
  included: {
    water: false,
    electricity: false,
    internet: false,
    gas: true
  },
  observations: "Apartamento recém reformado, com armários embutidos em todos os quartos. Portaria 24h, academia e piscina no condomínio. Próximo a metrô, mercados e escolas.",
  owner: {
    name: "Maria Silva",
    whatsapp: "5511999999999"
  }
};

export default function PropertyDetail() {
  const { id } = useParams();
  const property = mockProperty;

  const totalMonthly = property.pricing.rent + property.pricing.condominium + property.pricing.iptu + property.pricing.serviceFee;

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(`Olá! Vi o imóvel "${property.title}" no AlugaFácil e gostaria de mais informações.`);
    window.open(`https://wa.me/${property.owner.whatsapp}?text=${message}`, "_blank");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Back button */}
        <div className="container py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </div>

        {/* Image Gallery */}
        <section className="container pb-8" aria-label="Galeria de fotos">
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {property.images.map((image, index) => (
              <div 
                key={index} 
                className={`relative overflow-hidden rounded-xl ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              >
                <img
                  src={image}
                  alt={`Foto ${index + 1} do imóvel`}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  style={{ aspectRatio: index === 0 ? '16/10' : '16/9' }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Content */}
        <section className="container pb-16">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="animate-fade-in">
                <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                  {property.title}
                </h1>
                <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {property.address.street}, {property.address.number}
                    {property.address.complement && ` - ${property.address.complement}`}, {property.address.neighborhood}, {property.address.city} - {property.address.state}
                  </span>
                </div>

                {/* Quick Info */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                    <Bed className="h-4 w-4" aria-hidden="true" />
                    {property.details.bedrooms} quartos
                  </Badge>
                  <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                    <Bath className="h-4 w-4" aria-hidden="true" />
                    {property.details.bathrooms} banheiros
                  </Badge>
                  <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                    <Maximize className="h-4 w-4" aria-hidden="true" />
                    {property.details.area}m²
                  </Badge>
                  {property.details.garage && (
                    <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                      <Car className="h-4 w-4" aria-hidden="true" />
                      {property.details.garageSpots} vaga{property.details.garageSpots > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>

                <Separator className="my-8" />

                {/* Rooms */}
                <div>
                  <h2 className="font-display text-xl font-semibold">Cômodos</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {property.rooms.map((room) => (
                      <Badge key={room} variant="outline" className="px-3 py-1.5">
                        {room}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Rules & Policies */}
                <div>
                  <h2 className="font-display text-xl font-semibold">Regras e políticas</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${property.details.acceptsPets ? 'bg-success/10' : 'bg-destructive/10'}`}>
                        <PawPrint className={`h-5 w-5 ${property.details.acceptsPets ? 'text-success' : 'text-destructive'}`} aria-hidden="true" />
                      </div>
                      <span>{property.details.acceptsPets ? 'Aceita pets' : 'Não aceita pets'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${property.details.acceptsChildren ? 'bg-success/10' : 'bg-destructive/10'}`}>
                        <Baby className={`h-5 w-5 ${property.details.acceptsChildren ? 'text-success' : 'text-destructive'}`} aria-hidden="true" />
                      </div>
                      <span>{property.details.acceptsChildren ? 'Aceita crianças' : 'Não aceita crianças'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                        <Users className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
                      </div>
                      <span>Máximo {property.details.maxPeople} pessoas</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Included */}
                <div>
                  <h2 className="font-display text-xl font-semibold">Incluso no valor</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${property.included.water ? 'bg-success/10' : 'bg-muted'}`}>
                        <Droplets className={`h-5 w-5 ${property.included.water ? 'text-success' : 'text-muted-foreground'}`} aria-hidden="true" />
                      </div>
                      <span className={property.included.water ? '' : 'text-muted-foreground'}>
                        Água {property.included.water ? 'inclusa' : 'não inclusa'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${property.included.electricity ? 'bg-success/10' : 'bg-muted'}`}>
                        <Zap className={`h-5 w-5 ${property.included.electricity ? 'text-success' : 'text-muted-foreground'}`} aria-hidden="true" />
                      </div>
                      <span className={property.included.electricity ? '' : 'text-muted-foreground'}>
                        Luz {property.included.electricity ? 'inclusa' : 'não inclusa'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${property.included.internet ? 'bg-success/10' : 'bg-muted'}`}>
                        <Wifi className={`h-5 w-5 ${property.included.internet ? 'text-success' : 'text-muted-foreground'}`} aria-hidden="true" />
                      </div>
                      <span className={property.included.internet ? '' : 'text-muted-foreground'}>
                        Internet {property.included.internet ? 'inclusa' : 'não inclusa'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${property.included.gas ? 'bg-success/10' : 'bg-muted'}`}>
                        <Flame className={`h-5 w-5 ${property.included.gas ? 'text-success' : 'text-muted-foreground'}`} aria-hidden="true" />
                      </div>
                      <span className={property.included.gas ? '' : 'text-muted-foreground'}>
                        Gás {property.included.gas ? 'incluso' : 'não incluso'}
                      </span>
                    </div>
                  </div>
                </div>

                {property.observations && (
                  <>
                    <Separator className="my-8" />
                    <div>
                      <h2 className="font-display text-xl font-semibold">Observações</h2>
                      <p className="mt-4 text-muted-foreground leading-relaxed">
                        {property.observations}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar - Pricing Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 animate-slide-in-right border-border/50 shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-muted-foreground">Aluguel</span>
                      <span className="text-2xl font-bold text-foreground">
                        R$ {property.pricing.rent.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Condomínio</span>
                        <span>R$ {property.pricing.condominium.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">IPTU</span>
                        <span>R$ {property.pricing.iptu.toLocaleString('pt-BR')}</span>
                      </div>
                      {property.pricing.serviceFee > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Taxa de serviço</span>
                          <span>R$ {property.pricing.serviceFee.toLocaleString('pt-BR')}</span>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-baseline justify-between">
                      <span className="font-medium">Total mensal</span>
                      <span className="text-xl font-bold text-primary">
                        R$ {totalMonthly.toLocaleString('pt-BR')}
                      </span>
                    </div>

                    <Button 
                      size="lg" 
                      className="mt-4 w-full gap-2 text-base"
                      onClick={handleWhatsAppContact}
                    >
                      <MessageCircle className="h-5 w-5" aria-hidden="true" />
                      Falar com proprietário
                    </Button>
                    
                    <p className="text-center text-xs text-muted-foreground">
                      Contato direto via WhatsApp
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
