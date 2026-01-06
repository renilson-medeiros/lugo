"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
    Maximize,
    Loader2,
    ChevronLeft,
    Info,
    ChevronRight,
    UserPlus,
    UserMinus,
    Settings,

    AlertTriangle,
    X
} from "lucide-react";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Property {
    id: string;
    title: string;
    status: 'disponivel' | 'alugado' | 'manutencao';
    images: string[];
    address: {
        street: string;
        number: string;
        complement: string | null;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
    };
    details: {
        bedrooms: number | null;
        bathrooms: number | null;
        area: number | null;
        garage: boolean;
        garageSpots: number;
        acceptsPets: boolean;
        maxPeople: number | null;
        acceptsChildren: boolean;
    };
    rooms: string[];
    pricing: {
        rent: number;
        condominium: number;
        iptu: number;
        serviceFee: number;
    };
    included: {
        water: boolean;
        electricity: boolean;
        internet: boolean;
        gas: boolean;
    };
    observations: string | null;
    owner: {
        id: string;
        name: string;
        whatsapp: string;
    };
}

interface HistoricalTenant {
    id: string;
    nome_completo: string;
    data_inicio: string;
    data_fim: string | null;
    status: 'ativo' | 'inativo';
    valor_aluguel: number;
}

export default function PropertyDetailClient() {
    const router = useRouter();
    const params = useParams();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const { user } = useAuth();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [mainApi, setMainApi] = useState<CarouselApi>();
    const [thumbApi, setThumbApi] = useState<CarouselApi>();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [tenants, setTenants] = useState<HistoricalTenant[]>([]);
    const [loadingTenants, setLoadingTenants] = useState(false);
    const [isTerminating, setIsTerminating] = useState(false);
    const [showTerminateDialog, setShowTerminateDialog] = useState(false);
    const [isChanging, setIsChanging] = useState(false);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Sync carousels and update selected index
    useEffect(() => {
        if (!mainApi || !thumbApi) return;

        const onSelect = () => {
            const index = mainApi.selectedScrollSnap();
            setSelectedIndex(index);
            // Force thumb scroll to keep it in sync
            thumbApi.scrollTo(index);
        };

        const onThumbSelect = () => {
            const index = thumbApi.selectedScrollSnap();
            if (mainApi.selectedScrollSnap() !== index) {
                mainApi.scrollTo(index);
            }
        };

        mainApi.on("select", onSelect);
        thumbApi.on("select", onThumbSelect);

        // Initial index
        setSelectedIndex(mainApi.selectedScrollSnap());

        return () => {
            mainApi.off("select", onSelect);
            thumbApi.off("select", onThumbSelect);
        };
    }, [mainApi, thumbApi]);

    useEffect(() => {
        if (id) {
            loadProperty(id);
        }
    }, [id]);

    const loadProperty = async (propertyId: string) => {
        try {
            setLoading(true);

            // Buscar imóvel com dados do proprietário
            const { data: imovel, error } = await supabase
                .from('imoveis')
                .select(`
          *,
          profiles(nome_completo, telefone)
        `)
                .eq('id', propertyId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    setNotFound(true);
                    return;
                }
                throw error;
            }

            if (!imovel) {
                setNotFound(true);
                return;
            }

            // Formatar dados para o formato do componente
            const formattedProperty: Property = {
                id: imovel.id,
                title: imovel.titulo || `${imovel.endereco_rua}, ${imovel.endereco_numero}`,
                status: imovel.status || 'disponivel',
                images: imovel.fotos && imovel.fotos.length > 0
                    ? imovel.fotos
                    : ["/preview.png"],
                address: {
                    street: imovel.endereco_rua,
                    number: imovel.endereco_numero,
                    complement: imovel.endereco_complemento,
                    neighborhood: imovel.endereco_bairro,
                    city: imovel.endereco_cidade,
                    state: imovel.endereco_estado,
                    zipCode: imovel.endereco_cep || '',
                },
                details: {
                    bedrooms: imovel.quartos,
                    bathrooms: imovel.banheiros,
                    area: imovel.area_m2,
                    garage: imovel.tem_garagem || false,
                    garageSpots: imovel.tem_garagem ? 1 : 0,
                    acceptsPets: imovel.aceita_pets || false,
                    maxPeople: imovel.max_pessoas,
                    acceptsChildren: imovel.aceita_criancas !== false,
                },
                rooms: imovel.comodos || [],
                pricing: {
                    rent: imovel.valor_aluguel || 0,
                    condominium: imovel.valor_condominio || 0,
                    iptu: imovel.valor_iptu || 0,
                    serviceFee: imovel.valor_taxa_servico || 0,
                },
                included: {
                    water: imovel.inclui_agua || false,
                    electricity: imovel.inclui_luz || false,
                    internet: imovel.inclui_internet || false,
                    gas: imovel.inclui_gas || false,
                },
                observations: imovel.descricao,
                owner: {
                    id: imovel.proprietario_id,
                    name: imovel.profiles?.nome_completo || 'Proprietário',
                    whatsapp: imovel.profiles?.telefone?.replace(/\D/g, '') || '',
                },
            };

            setProperty(formattedProperty);

            // Carregar histórico de inquilinos se for o dono
            if (user?.id === imovel.proprietario_id) {
                loadTenants(propertyId);
            }
        } catch (error) {
            console.error('Erro ao carregar imóvel:', error);
            toast.error('Erro ao carregar imóvel');
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    const loadTenants = async (propertyId: string) => {
        try {
            setLoadingTenants(true);
            const { data, error } = await supabase
                .from('inquilinos')
                .select('id, nome_completo, data_inicio, data_fim, status, valor_aluguel')
                .eq('imovel_id', propertyId)
                .order('data_inicio', { ascending: false });

            if (error) throw error;
            setTenants(data || []);
        } catch (error) {
            console.error('Erro ao carregar inquilinos:', error);
        } finally {
            setLoadingTenants(false);
        }
    };

    const handleWhatsAppContact = () => {
        if (!property) return;

        const propertyLink = window.location.href;
        const message = encodeURIComponent(
            `Olá! Vi o imóvel\n\n*${property.title}*\n${propertyLink}\n\nE gostaria de mais informações.`
        );
        window.open(`https://wa.me/55${property.owner.whatsapp}?text=${message}`, "_blank");
    };

    const handleTerminateLease = async (isChangeFlow = false) => {
        try {
            if (!id) return;
            setIsTerminating(true);

            // 1. Encontrar o inquilino ativo para este imóvel
            const { data: inquilino } = await supabase
                .from('inquilinos')
                .select('id')
                .eq('imovel_id', id)
                .eq('status', 'ativo')
                .single();

            if (inquilino) {
                // 2. Buscar todos os comprovantes do inquilino para deletar PDFs
                const { data: comprovantes } = await supabase
                    .from('comprovantes')
                    .select('pdf_url')
                    .eq('inquilino_id', inquilino.id);

                // 3. Deletar PDFs do Storage
                if (comprovantes && comprovantes.length > 0) {
                    const pdfPaths = comprovantes
                        .filter(c => c.pdf_url)
                        .map(c => {
                            // Extrair o caminho do arquivo da URL
                            const url = new URL(c.pdf_url!);
                            const pathParts = url.pathname.split('/');
                            // Pegar tudo depois de 'imoveis-fotos/'
                            const bucketIndex = pathParts.findIndex(p => p === 'imoveis-fotos');
                            return pathParts.slice(bucketIndex + 1).join('/');
                        });

                    if (pdfPaths.length > 0) {
                        await supabase.storage
                            .from('imoveis-fotos')
                            .remove(pdfPaths);
                    }
                }

                // 4. Deletar comprovantes do banco
                await supabase
                    .from('comprovantes')
                    .delete()
                    .eq('inquilino_id', inquilino.id);

                // 5. Inativar o inquilino
                await supabase
                    .from('inquilinos')
                    .update({
                        status: 'inativo',
                        data_fim: new Date().toISOString().split('T')[0]
                    })
                    .eq('id', inquilino.id);
            }

            // 6. Voltar o imóvel para disponível
            const { error: propertyError } = await supabase
                .from('imoveis')
                .update({ status: 'disponivel' })
                .eq('id', id);

            if (propertyError) throw propertyError;

            toast.success('Locação finalizada!', {
                description: 'Comprovantes e PDFs foram removidos.'
            });

            if (!isChangeFlow) {
                loadProperty(id as string);
            }
        } catch (error) {
            console.error('Erro ao finalizar locação:', error);
            toast.error('Erro ao finalizar locação');
        } finally {
            setIsTerminating(false);
            setShowTerminateDialog(false);
        }
    };

    const handleChangeTenant = async () => {
        if (!id) return;
        setIsChanging(true);
        await handleTerminateLease(true);
        router.push(`/dashboard/imoveis/${id}/inquilino`);
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center py-16">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
                        <p className="text-muted-foreground">Carregando imóvel...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Not found state
    if (notFound || !property) {
        return (
            <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center py-16">
                        <Home className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Imóvel não encontrado</h2>
                        <p className="text-muted-foreground mb-6">
                            O imóvel que você procura não existe ou foi removido.
                        </p>
                        <Button
                            className="bg-blue-500 hover:bg-blue-500"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Voltar
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const totalMonthly = property.pricing.rent + property.pricing.condominium + property.pricing.iptu + property.pricing.serviceFee;

    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1 -px-4">
                {/* Navigation / Info text */}
                <div className="container px-4 py-4">
                    {user ? (
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Voltar
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 text-muted-foreground py-2">
                            <Info className="w-4 h-4 text-blue-500" />
                            <span>Informações do Imóvel de {property.owner.name}</span>
                        </div>
                    )}
                </div>

                {/* Advanced Image Gallery */}
                <section className="container px-4 pb-8" aria-label="Galeria de fotos">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[300px] md:h-[500px] lg:h-[580px]">
                        {/* Main Carousel (Left) */}
                        <div className="lg:col-span-3 relative rounded-lg overflow-hidden bg-muted shadow-sm border border-black/5 h-full">
                            <Carousel
                                setApi={setMainApi}
                                className="w-full h-full group"
                                opts={{
                                    loop: true,
                                    duration: 20
                                }}
                            >
                                <CarouselContent className="h-full ml-0">
                                    {property.images.map((image, index) => (
                                        <CarouselItem key={index} className="h-full pl-0">
                                            <div
                                                className="relative w-full h-full overflow-hidden cursor-zoom-in"
                                                onClick={() => {
                                                    setSelectedIndex(index);
                                                    setIsLightboxOpen(true);
                                                }}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`Foto ${index + 1} do imóvel`}
                                                    className="w-full min-h-full object-cover h-[350px] md:h-[600px] md:min-h-full md:object-cover hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>

                                {/* Pagination Dots */}
                                {property.images.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 transition-opacity opacity-100">
                                        {property.images.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => mainApi?.scrollTo(index)}
                                                className={cn(
                                                    "h-1.5 rounded-full transition-all duration-300",
                                                    selectedIndex === index
                                                        ? "w-6 bg-blue-600 shadow-sm"
                                                        : "w-1.5 bg-white/50 hover:bg-white/80"
                                                )}
                                                aria-label={`Ir para slide ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                )}

                                {property.images.length > 1 && (
                                    <>
                                        <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-all bg-white/90 hover:bg-white border-none shadow-lg text-foreground h-11 w-11" />
                                        <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-all bg-white/90 hover:bg-white border-none shadow-lg text-foreground h-11 w-11" />
                                    </>
                                )}
                            </Carousel>
                        </div>

                        {/* Thumbnail Carousel (Right - Vertical) */}
                        <div className="hidden lg:block lg:col-span-1 h-full overflow-hidden">
                            <Carousel
                                setApi={setThumbApi}
                                orientation="vertical"
                                className="w-full h-full"
                                opts={{
                                    loop: true,
                                    align: "start",
                                    containScroll: false
                                }}
                            >
                                <CarouselContent className="h-full -mt-4">
                                    {property.images.map((image, index) => (
                                        <CarouselItem
                                            key={index}
                                            className="pt-4 basis-1/2 h-1/2"
                                            onClick={() => mainApi?.scrollTo(index)}
                                        >
                                            <div className={cn(
                                                "relative h-full w-full overflow-hidden rounded-lg border-2 transition-all duration-300 cursor-pointer",
                                                selectedIndex === index
                                                    ? "border-blue-500 shadow-lg opacity-100"
                                                    : "border-transparent opacity-40 hover:opacity-100"
                                            )}>
                                                <img
                                                    src={image}
                                                    alt={`Miniatura ${index + 1}`}
                                                    className="w-[495px] h-[250px] object-cover"
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}

                                </CarouselContent>
                                <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-background/95 to-transparent"></div>
                            </Carousel>
                        </div>


                    </div>
                </section>

                {/* Lightbox Dialog */}
                <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
                    <DialogContent className="max-w-[100vw] h-screen p-0 bg-black/5 border-none z-150 flex flex-col items-center justify-center outline-none [&>button.opacity-70]:hidden">
                        <DialogTitle className="sr-only">Galeria de fotos</DialogTitle>

                        {/* Close Button */}
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute cursor-pointer right-4 top-4 z-160 rounded-full bg-blue-600 p-2 text-white/70 backdrop-blur-sm transition-colors hover:bg-blue-500 hover:text-white sm:right-8 sm:top-8"
                            aria-label="Fechar galeria"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <Carousel
                            setApi={setMainApi}
                            className="w-full h-full flex items-center justify-center [&_div.overflow-hidden]:h-full"
                            opts={{
                                loop: true,
                                startIndex: selectedIndex,
                            }}
                        >
                            <CarouselContent className="h-full m-0 p-0">
                                {property.images.map((image, index) => (
                                    <CarouselItem key={index} className="h-full flex items-center justify-center p-0 pl-0">
                                        <div className="relative w-full h-full flex items-center justify-center">
                                            <img
                                                src={image}
                                                alt={`Foto ${index + 1} ampliada`}
                                                className="max-h-[85vh] max-w-[95vw] rounded-lg object-contain select-none shadow-2xl"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            {property.images.length > 1 && (
                                <>
                                    <CarouselPrevious
                                        className="fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 h-12 w-12 border-none bg-background text-blue-600 hover:text-blue-600 hover:bg-background/80 z-160 active:scale-95 transition-all"
                                    />
                                    <CarouselNext
                                        className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 h-12 w-12 border-none bg-background text-blue-600 hover:text-blue-600 hover:bg-background/80 z-160 active:scale-95 transition-all"
                                    />
                                </>
                            )}
                        </Carousel>

                        {/* Thumbnails Indicator */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-160 flex gap-2 overflow-x-auto max-w-[90vw] p-2 no-scrollbar">
                            {property.images.map((_, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "h-1.5 rounded-full transition-all duration-300 shadow-sm",
                                        selectedIndex === index ? "bg-blue-600 w-6" : "w-1.5 bg-white/40"
                                    )}
                                />
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Content */}
                <section className="container px-4 pb-16">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <div className="animate-fade-in">
                                <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                                    {property.title}
                                </h1>
                                <div className="mt-2 flex items-baseline gap-2 text-muted-foreground">
                                    <MapPin className="h-4 w-4 text-blue-500" aria-hidden="true" />
                                    <span>
                                        {property.address.street}, {property.address.number}
                                        {property.address.complement && ` - ${property.address.complement}`}, {property.address.neighborhood}, {property.address.city} - {property.address.state}
                                    </span>
                                </div>

                                {/* Quick Info */}
                                <div className="mt-6 flex flex-wrap gap-3">
                                    {property.details.bedrooms !== null && property.details.bedrooms > 0 && (
                                        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                                            <Bed className="h-4 w-4" aria-hidden="true" />
                                            {property.details.bedrooms} quartos
                                        </Badge>
                                    )}
                                    {property.details.bathrooms !== null && property.details.bathrooms > 0 && (
                                        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                                            <Bath className="h-4 w-4" aria-hidden="true" />
                                            {property.details.bathrooms} banheiros
                                        </Badge>
                                    )}
                                    {property.details.area !== null && property.details.area > 0 && (
                                        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                                            <Maximize className="h-4 w-4" aria-hidden="true" />
                                            {property.details.area}m²
                                        </Badge>
                                    )}
                                    {property.details.garage && (
                                        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                                            <Car className="h-4 w-4" aria-hidden="true" />
                                            {property.details.garageSpots} vaga{property.details.garageSpots > 1 ? 's' : ''}
                                        </Badge>
                                    )}
                                </div>

                                {property.rooms.length > 0 && (
                                    <>
                                        <Separator className="my-8" />

                                        {/* Rooms */}
                                        <div>
                                            <h2 className="font-display text-xl font-semibold">Cômodos</h2>
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {property.rooms.map((room) => (
                                                    <Badge key={room} variant="outline" className="px-3 py-1.5 capitalize">
                                                        {room}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                <Separator className="my-8" />

                                {/* Rules & Policies */}
                                <div>
                                    <h2 className="font-display text-xl font-semibold">Regras e políticas</h2>
                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${property.details.acceptsPets ? 'bg-blue-500/10' : 'bg-destructive/10'}`}>
                                                <PawPrint className={`h-5 w-5 ${property.details.acceptsPets ? 'text-blue-500' : 'text-destructive'}`} aria-hidden="true" />
                                            </div>
                                            <span>{property.details.acceptsPets ? 'Aceita pets' : 'Não aceita pets'}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${property.details.acceptsChildren ? 'bg-blue-500/10' : 'bg-destructive/10'}`}>
                                                <Baby className={`h-5 w-5 ${property.details.acceptsChildren ? 'text-blue-500' : 'text-destructive'}`} aria-hidden="true" />
                                            </div>
                                            <span>{property.details.acceptsChildren ? 'Aceita crianças' : 'Não aceita crianças'}</span>
                                        </div>
                                        {property.details.maxPeople !== null && property.details.maxPeople > 0 && (
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                                                    <Users className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
                                                </div>
                                                <span>Máximo {property.details.maxPeople} pessoas</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Separator className="my-8" />

                                {/* Included */}
                                <div>
                                    <h2 className="font-display text-xl font-semibold">Incluso no valor</h2>
                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${property.included.water ? 'bg-blue-500/10' : 'bg-muted'}`}>
                                                <Droplets className={`h-5 w-5 ${property.included.water ? 'text-blue-500' : 'text-muted-foreground'}`} aria-hidden="true" />
                                            </div>
                                            <span className={property.included.water ? '' : 'text-muted-foreground'}>
                                                Água {property.included.water ? 'inclusa' : 'não inclusa'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${property.included.electricity ? 'bg-blue-500/10' : 'bg-muted'}`}>
                                                <Zap className={`h-5 w-5 ${property.included.electricity ? 'text-blue-500' : 'text-muted-foreground'}`} aria-hidden="true" />
                                            </div>
                                            <span className={property.included.electricity ? '' : 'text-muted-foreground'}>
                                                Luz {property.included.electricity ? 'inclusa' : 'não inclusa'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${property.included.internet ? 'bg-blue-500/10' : 'bg-muted'}`}>
                                                <Wifi className={`h-5 w-5 ${property.included.internet ? 'text-blue-500' : 'text-muted-foreground'}`} aria-hidden="true" />
                                            </div>
                                            <span className={property.included.internet ? '' : 'text-muted-foreground'}>
                                                Internet {property.included.internet ? 'inclusa' : 'não inclusa'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${property.included.gas ? 'bg-blue-500/10' : 'bg-muted'}`}>
                                                <Flame className={`h-5 w-5 ${property.included.gas ? 'text-blue-500' : 'text-muted-foreground'}`} aria-hidden="true" />
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

                                {/* Histórico de Locações (Apenas para o Proprietário) */}
                                {user?.id === property.owner.id && (
                                    <>
                                        <Separator className="my-8" />
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <h2 className="font-display text-xl font-semibold">Histórico de Locações</h2>
                                                <Badge variant="outline" className="font-normal text-muted-foreground">
                                                    {tenants.length} registro{tenants.length !== 1 ? 's' : ''}
                                                </Badge>
                                            </div>

                                            <div className="mt-6 space-y-4">
                                                {loadingTenants ? (
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Carregando histórico...
                                                    </div>
                                                ) : tenants.length > 0 ? (
                                                    <div className="rounded-lg border border-border overflow-hidden">
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full text-sm text-left">
                                                                <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                                                                    <tr>
                                                                        <th className="px-4 py-3 font-medium">Inquilino</th>
                                                                        <th className="px-4 py-3 font-medium">Período</th>
                                                                        <th className="px-4 py-3 font-medium">Valor</th>
                                                                        <th className="px-4 py-3 font-medium">Status</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-border">
                                                                    {tenants.map((tenant) => (
                                                                        <tr key={tenant.id} className="hover:bg-muted/30 transition-colors">
                                                                            <td className="px-4 py-4 font-medium">{tenant.nome_completo}</td>
                                                                            <td className="px-4 py-4 text-muted-foreground">
                                                                                {new Date(tenant.data_inicio).toLocaleDateString('pt-BR')} - {tenant.data_fim ? new Date(tenant.data_fim).toLocaleDateString('pt-BR') : 'Atual'}
                                                                            </td>
                                                                            <td className="px-4 py-4">
                                                                                {tenant.valor_aluguel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                                            </td>
                                                                            <td className="px-4 py-4">
                                                                                <Badge variant={tenant.status === 'ativo' ? 'default' : 'secondary'}>
                                                                                    {tenant.status}
                                                                                </Badge>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
                                                        <Users className="h-8 w-8 mb-2 opacity-50" />
                                                        <p>Nenhum histórico encontrado para este imóvel.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Sidebar (Pricing & Actions) */}
                        <div className="space-y-6 lg:col-span-1">
                            <Card className="border-primary/10 shadow-sm overflow-hidden sticky top-24">
                                <CardContent className="p-6">
                                    <div className="mb-6">
                                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Valor total mensal</p>
                                        <div className="mt-2 flex items-baseline gap-1">
                                            <span className="text-sm font-medium text-muted-foreground">R$</span>
                                            <span className="font-display text-4xl font-bold">{totalMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 text-sm">
                                        <div className="flex justify-between border-b pb-4">
                                            <span className="text-muted-foreground">Aluguel:</span>
                                            <span className="font-medium">{property.pricing.rent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                        </div>
                                        {property.pricing.condominium > 0 && (
                                            <div className="flex justify-between border-b pb-4">
                                                <span className="text-muted-foreground">Condomínio:</span>
                                                <span className="font-medium">{property.pricing.condominium.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                            </div>
                                        )}
                                        {property.pricing.iptu > 0 && (
                                            <div className="flex justify-between border-b pb-4">
                                                <span className="text-muted-foreground">IPTU:</span>
                                                <span className="font-medium">{property.pricing.iptu.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                            </div>
                                        )}
                                        {property.pricing.serviceFee > 0 && (
                                            <div className="flex justify-between border-b pb-4">
                                                <span className="text-muted-foreground">Taxa de Serviço:</span>
                                                <span className="font-medium">{property.pricing.serviceFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-8 space-y-3">
                                        {user?.id === property.owner.id ? (
                                            <>
                                                <Button
                                                    className={`w-full h-12 text-base ${property.status === 'alugado' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-500'}`}
                                                    onClick={() => {
                                                        if (property.status === 'alugado') {
                                                            setShowTerminateDialog(true);
                                                        } else {
                                                            router.push(`/dashboard/imoveis/${property.id}/inquilino`);
                                                        }
                                                    }}
                                                >
                                                    {property.status === 'alugado' ? (
                                                        <>
                                                            <AlertTriangle className="h-4 w-4 mr-2" />
                                                            Encerrar Contrato
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserPlus className="h-4 w-4 mr-2" />
                                                            Registrar Inquilino
                                                        </>
                                                    )}
                                                </Button>

                                                {/* Botão de Trocar Inquilino (apenas se alugado) */}
                                                {property.status === 'alugado' && (
                                                    <Button
                                                        variant="outline"
                                                        className="w-full h-12 border-dashed border-2"
                                                        onClick={handleChangeTenant}
                                                    >
                                                        <UserPlus className="h-4 w-4 mr-2" />
                                                        Trocar Inquilino
                                                    </Button>
                                                )}

                                                <Button
                                                    variant="outline"
                                                    className="w-full h-12"
                                                    onClick={() => router.push(`/dashboard/imoveis/editar/${property.id}`)}
                                                >
                                                    <Settings className="h-4 w-4 mr-2" />
                                                    Editar Imóvel
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                className="w-full bg-green-600 hover:bg-green-700 h-14 text-base shadow-lg shadow-green-200"
                                                onClick={handleWhatsAppContact}
                                            >
                                                <MessageCircle className="h-5 w-5 mr-2" />
                                                Conversar com Proprietário
                                            </Button>
                                        )}
                                    </div>

                                    <p className="mt-4 text-center text-xs text-muted-foreground">
                                        Código do imóvel: <span className="font-mono bg-muted px-1 rounded">{property.id.slice(0, 8)}</span>
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Owner Info (if not owner) */}
                            {user?.id !== property.owner.id && (
                                <Card>
                                    <CardContent className="p-6 flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                            {property.owner.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{property.owner.name}</p>
                                            <p className="text-sm text-muted-foreground">Proprietário verificado</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </section>


                {/* Terminate Lease Dialog */}
                <AlertDialog open={showTerminateDialog} onOpenChange={setShowTerminateDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Encerrar contrato de locação?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta ação irá alterar o status do imóvel para "Disponível" e mover o inquilino atual para o histórico.
                                <br /><br />
                                <span className="font-semibold text-destructive">Atenção:</span> Todos os comprovantes e arquivos associados a esta locação serão excluídos permanentemente para liberar espaço.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isTerminating}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() => handleTerminateLease()}
                                disabled={isTerminating}
                            >
                                {isTerminating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Encerrando...
                                    </>
                                ) : (
                                    "Sim, encerrar contrato"
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </main>

            <Footer />
        </div>
    );
}
